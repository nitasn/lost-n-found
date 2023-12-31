import { createGlobalState, useGlobalState } from "./useGlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendGetRequestToServer } from "./sendServerReq";
import alerto from "../components/Alerto";
import { getLocation } from "./location";
import { geoDistance, sleep } from "./utils";

const AllPosts = createGlobalState([]);
const IsFetching = createGlobalState(false);

export function useAllPosts() {
  const [allPosts] = useGlobalState(AllPosts);
  const [isFetching] = useGlobalState(IsFetching);
  // not exposing the setters (e.g. no "setIsFetching")
  return { allPosts, isFetching };
}

export function addPostToGlobalState(postData) {
  AllPosts.set([...AllPosts.get(), postData]);
}

AsyncStorage.getItem("allPosts")
  .then((posts) => posts && AllPosts.set(JSON.parse(posts)))
  .finally(updatePosts);

export async function updatePosts() {
  if (!_promiseFetching) {
    _promiseFetching = (async () => {
      _hasFetched && IsFetching.set(true);
      await _doUpdatePosts();
      _hasFetched && IsFetching.set(false);
      _promiseFetching = null;
      _hasFetched = true;
    })();
  } else {
    if (_anotherFetchRequested) return;
    _anotherFetchRequested = true;
    await _promiseFetching;
    _anotherFetchRequested = false;
    updatePosts();
  }
}

// this is to prevent the feed from looking "refreshing" on first load
let _hasFetched = false;
// this is to prevent race conditions.
// we manage overlapping calls to a _doUpdatePosts (which updates state).
let _promiseFetching = null;
// this is to reduce future fetches into one fetch
let _anotherFetchRequested = false;

async function _doUpdatePosts() {
  let fetchedPosts;

  try {
    const response = await sendGetRequestToServer("/api/get-all-posts", { withAuth: false });
    fetchedPosts = await response.json();
  } catch (err) {
    return alerto({
      title: "Couldn't Fetch Posts",
      message:
        "Couldn't fetch posts from the server. Are you connected to the internet?\n\n" +
        `Error message: ${err.message}`,
    });
  }

  AllPosts.set(
    fetchedPosts.map((post) => {
      const proximityInKm = proximityInKmByPostId.get(post._id);
      if (!proximityInKm) return post;
      return { ...post, proximityInKm };
    })
  );

  const writeToDisk = async () => {
    try {
      await AsyncStorage.setItem("allPosts", JSON.stringify(fetchedPosts));
    } catch {
      /* ignore */
    }
  };

  const updateProximities = async () => {
    const location = await getLocation();
    if (!location) return;

    const { latitude, longitude } = location;

    AllPosts.set((posts) =>
      posts.map((post) => {
        if (!post.location?.latLong) return post;
        const proximityInKm = geoDistance(latitude, longitude, ...post.location.latLong);
        proximityInKmByPostId.set(post._id, proximityInKm);
        return { ...post, proximityInKm };
      })
    );
  };

  await Promise.all([updateProximities(), writeToDisk()]);
}

const proximityInKmByPostId = new Map(); // cache | todo invalidate cache on pull to refresh
