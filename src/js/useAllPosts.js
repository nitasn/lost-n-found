import { createGlobalState, useGlobalState } from "./useGlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendGetRequestToServer } from "./sendServerReq";
import alerto from "../components/Alerto";

const allPosts = createGlobalState([]);
export const useAllPosts = () => useGlobalState(allPosts);

export function addPostToGlobalState(postData) {
  allPosts.set([...allPosts.get(), postData]);
}

AsyncStorage.getItem("allPosts")
  .then((posts) => posts && allPosts.set(JSON.parse(posts)))
  .finally(fetchPostsFromServer);

export async function fetchPostsFromServer() {
  try {
    const response = await sendGetRequestToServer("/api/get-all-posts", { withAuth: false });
    const posts = await response.json();
    allPosts.set(posts);
  }
  catch (err) {
    alerto({
      title: "Couldn't Fetch Posts",
      message:
        "Couldn't fetch posts from the server. Are you connected to the internet?\n\n" +
        `Error message: ${err.message}`,
    });
  }
  AsyncStorage.setItem("allPosts", JSON.stringify(allPosts.get()));
}
