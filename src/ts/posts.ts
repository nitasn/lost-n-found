import useSWR from "swr";
import { serverGET } from "../js/sendServerReq";
import { useEffect, useState } from "react";
import { createReducedAsyncQueue } from "./async-queue";
import { getLocation } from "../js/location";
import { createGlobalState, useGlobalState } from "./useGlobalState";
import { geoDistance } from "../js/utils";
import { withLocalStorageFallback } from "./localStorage";

export type PostData = {
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

async function fetchPosts(path: string): Promise<PostData[]> {
  const res = await serverGET(path, { withAuth: false });
  return await res.json();
}

function useAllPosts() {
  const { data: allPosts, isLoading, error, mutate } = useSWR("/api/get-all-posts", fetchPosts);

  useEffect(() => {
    allPosts && disptachDistCalc(allPosts);
  }, [allPosts]);

  return { allPosts, isLoading, error, refetchPosts: mutate };
}

export default withLocalStorageFallback(useAllPosts, 'allPosts');

const DistancesMap = createGlobalState(new Map<string, number>());

const disptachDistCalc = (() => {
  let prevLocation = null;
  const queue = createReducedAsyncQueue();

  const _doCalculateDists = async (allPosts: PostData[]) => {
    const location = await getLocation(); // TODO no prompt!
    if (!location) return;

    const { latitude, longitude } = location;

    const nextLocation = `${latitude.toFixed(4)},${longitude.toFixed(4)}`; // ~11 meters
    const atSameLocation = nextLocation === prevLocation;
    prevLocation = nextLocation;

    const prevMap = DistancesMap.get();
    if (atSameLocation && allPostsWithLocationAreCached(prevMap, allPosts)) {
      return;
    }

    const updatedLocations: Array<[string, number]> = allPosts
      .filter((post) => post.location?.latLong)
      .map((post) => {
        const proximityInKm = atSameLocation
          ? prevMap.get(post._id) ?? geoDistance(latitude, longitude, ...post.location.latLong)
          : geoDistance(latitude, longitude, ...post.location.latLong);
        return [post._id, proximityInKm];
      });

    DistancesMap.set(new Map(updatedLocations));
  };

  return (allPosts: PostData[]) => queue(_doCalculateDists, allPosts);
})();

function allPostsWithLocationAreCached(prevMap: Map<string, number>, allPosts: PostData[]) {
  for (const post of allPosts) {
    if (post.location?.latLong && !prevMap.has(post._id)) {
      return false;
    }
  }
  return true;
}

export function usePostDistance(postId: string): number | null {
  const [distance, setDistance] = useState<number | null>(null);
  const [map] = useGlobalState(DistancesMap);

  useEffect(() => {
    const distance = map.get(postId) ?? null;
    setDistance(distance);
  }, [map]);

  return distance;
}
