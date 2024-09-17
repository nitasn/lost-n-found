import { serverGET } from "../js/sendServerReq";
import { createGlobalState, useGlobalState } from "./useGlobalState";
import { createReducedAsyncQueue } from "./async-queue";
import { getLocation } from "../js/location";
import { geoDistance } from "../js/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ms from "ms";
import { useEffect } from "react";

type PostData = {
  _id: string;
  type: "lost" | "found";
  isStillAvailable: boolean;
  title: string;
  text?: string;
  picsUrls: string[];
  date: string;
  location?: {
    latLong: [number, number];
    name: string;
  };
  author: {
    _id: string;
    name: string;
    profilePicUrl: string;
  };
  proximityInKm?: number;
};

export const AllPosts = createGlobalState<PostData[]>([]);

type FetchInitiator = "user" | "app";

interface FetchStateType {
  isFetching: boolean;
  initiator?: FetchInitiator;
  error?: Error;
}

const FetchState = createGlobalState<FetchStateType>({
  isFetching: true,
  initiator: "app",
});

export function useAllPosts() {
  const [allPosts] = useGlobalState(AllPosts);
  return allPosts;
}

export function usePostsFetchState() {
  const [fetchState] = useGlobalState(FetchState);
  return fetchState;
}

export function addPostToGlobalState(post: PostData) {
  AllPosts.set([post, ...AllPosts.get()]);
}

export const dispatchPostsFetch = (() => {
  const queue = createReducedAsyncQueue();

  return ({ initiator = "app" }: { initiator?: FetchInitiator } = {}) => {
    if (FetchState.get().initiator === "app" && initiator === "user") {
      // promote ongoing fetch's initiator to "user", and schedule another "app" fetch.
      FetchState.set({ isFetching: true, initiator: "user" });
      return dispatchPostsFetch({ initiator: "app" });
    }
    queue(async () => {
      FetchState.set({ isFetching: true, initiator });
      try {
        const res = await serverGET("/api/get-all-posts");
        const posts = await res.json();
        AllPosts.set(posts);
        FetchState.set({ isFetching: false });
      } catch (error) {
        FetchState.set({ isFetching: false, error });
      }
    });
  };
})();

const disptachDistCalc = (() => {
  let cacheKey = null;
  const cache = new Map();
  const queue = createReducedAsyncQueue();

  const _doCalculateDists = async () => {
    const location = await getLocation();
    if (!location) return;

    const { latitude, longitude } = location;

    const newCacheKey = latitude.toFixed(4) + longitude.toFixed(4); // ~11 meters
    if (newCacheKey === cacheKey) return;

    cacheKey = newCacheKey;
    cache.clear();

    AllPosts.set((allPosts) => {
      return allPosts.map((post) => {
        if (!post.location?.latLong) return post;
        const proximityInKm = geoDistance(latitude, longitude, ...post.location.latLong);
        cache.set(post._id, proximityInKm);
        return { ...post, proximityInKm };
      });
    });
  };

  return () => queue(_doCalculateDists);
})();

(async function startup() {
  const posts = await AsyncStorage.getItem("allPosts")
    .then(JSON.parse)
    .catch(() => null);

  posts && AllPosts.set(posts);

  AllPosts.subscribe((posts) => {
    AsyncStorage.setItem("allPosts", JSON.stringify(posts));
    disptachDistCalc();
  });

  dispatchPostsFetch({ initiator: "app" });
})();

export function useTopLevelPostsPolling() {
  useEffect(() => {
    const id = setInterval(() => {
      if (!FetchState.get().isFetching) {
        dispatchPostsFetch({ initiator: "app" });
      }
    }, ms("5 minutes"));
    return () => clearInterval(id);
  }, []);
}
