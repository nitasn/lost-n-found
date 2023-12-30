import { createGlobalState, useGlobalState } from "./useGlobalState";

import dummyPosts from "./dummyPosts.json";

const allPosts = createGlobalState(dummyPosts);
export const useAllPosts = () => useGlobalState(allPosts);

// todo fetch periodically

export function addPostToGlobalState(postData) {
  allPosts.set([...allPosts.get(), postData]);
}
