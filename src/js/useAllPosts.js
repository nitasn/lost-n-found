import { createGlobalState, useGlobalState } from "./useGlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendGetRequestToServer } from "./sendServerReq";
import alerto from "../components/Alerto";
import { getLocation } from "./location";
import { geoDistance } from "./utils";

const allPosts = createGlobalState([]);
export const useAllPosts = () => useGlobalState(allPosts);

export function addPostToGlobalState(postData) {
  allPosts.set([...allPosts.get(), postData]);
}

AsyncStorage.getItem("allPosts")
  .then((posts) => posts && allPosts.set(JSON.parse(posts)))
  .finally(updatePosts); // todo enable


// todo make sure this function is not invoked until the previous run is finished
// to avoid race conditions regarding allPosts.set
export async function updatePosts() {
  let fetchedPosts;

  try {
    const response = await sendGetRequestToServer("/api/get-all-posts", { withAuth: false });
    fetchedPosts = await response.json();
  }
  catch (err) {
    return alerto({
      title: "Couldn't Fetch Posts",
      message:
        "Couldn't fetch posts from the server. Are you connected to the internet?\n\n" +
        `Error message: ${err.message}`,
    });
  }

  allPosts.set(fetchedPosts.map((post) => {
    const proximityInKm = proximityInKmByPostId.get(post._id);
    if (!proximityInKm) return post;
    return { ...post, proximityInKm };
  }));

  await AsyncStorage.setItem("allPosts", JSON.stringify(fetchedPosts)).catch(() => undefined /* ignore */);

  const location = await getLocation();
  if (!location) return;

  const { latitude, longitude } = location;

  allPosts.set((posts) => posts.map((post) => {
    if (!post.location?.latLong) return post;
    const proximityInKm = geoDistance(latitude, longitude, ...post.location.latLong);
    proximityInKmByPostId.set(post._id, proximityInKm);
    return { ...post, proximityInKm };
  }));
}

const proximityInKmByPostId = new Map(); // cache