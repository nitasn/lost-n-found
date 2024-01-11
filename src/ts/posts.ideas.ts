// import { serverGET } from "../js/sendServerReq";
// import { createGlobalState, useGlobalState } from "./useGlobalState";
// import { createReducedAsyncQueue } from "./async-queue";
// import { getLocation } from "../js/location";
// import { geoDistance } from "../js/utils";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useState, useEffect } from "react";

// type PostData = {
//   _id: string;
//   type: "lost" | "found";
//   isStillAvailable: boolean;
//   title: string;
//   text?: string;
//   picsUrls: string[];
//   date: string;
//   location?: {
//     latLong: [number, number];
//     name: string;
//   };
//   author: {
//     _id: string;
//     name: string;
//     profilePicUrl: string;
//   };
//   proximityInKm?: number;
// };

// import useSWR, { preload, cache } from "swr";


// const KEY_ALL_POSTS = "/api/get-all-posts";

// preload(KEY_ALL_POSTS, fetcher);

// async function fetcher(key: string) {
//   const res = await serverGET(key);
//   return await res.json();
// }

// function useCachedSWR() {
//   const { data, error, mutate } = useSWR(KEY_ALL_POSTS, fetcher, {
//     revalidateIfStale: false,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     dedupingInterval: 30_000, // todo???
//   });

//   useEffect(() => {
//     (async () => {
//       const cachedData = await AsyncStorage.getItem("allPosts");
//       if (!cachedData) return;
//       mutate(JSON.parse(cachedData), {
//         revalidate: false,
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     if (data) {
//       AsyncStorage.setItem("allPosts", JSON.stringify(data));
//     }
//   }, [data]);

//   return { data, error };
// }

// function usePost(postId: string) {
//   const findPostInCache = () => {
//     const allPosts = cache.get(KEY_ALL_POSTS);
//     return allPosts?.find((post) => post.id === postId);
//   };

//   const {data} = useSWR()

//   // Try to get the post from cache
//   const cachedPost = findPostInCache();

//   // Use SWR to fetch the post only if it's not in the cache
//   const { data: post, error } = useSWR(cachedPost ? null : `/api/get-post/${postId}`, fetcher);

//   // Use the cached post or the fetched post
//   const finalPost = cachedPost || post;

//   // Render your component...
// }

// type Fetching = false | "user-initiated" | "app-initiated";

// export function useAllPosts() {}

// export function usePostsFetchState() {}

// export function addPostToGlobalState(post: PostData) {}

// export function dispatchPostsFetch() {}
