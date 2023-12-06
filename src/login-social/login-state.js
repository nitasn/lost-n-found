import { createGlobalState, useGlobalState } from "../js/useGlobalState";
import * as SecureStore from "expo-secure-store";

/**
 * @typedef {Object} User
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {('apple' | 'facebook' | 'google')} signInMethod
 */

const userState = createGlobalState(null);

export const useUser = () => useGlobalState(userState);

// on load, init user (if user was already logged in)
// SecureStore.getItemAsync("user-credentials").then((json) => {
//   if (json) {
//     console.log("init: getting user object from storage...");
//     userState.set(JSON.parse(json));
//   } else {
//     console.log("init: could NOT get user object from storage");
//   }
// });

// userState.subscribe((newState) => {
//   console.log("setting storage to", newState);
//   SecureStore.setItemAsync("user-credentials", JSON.stringify(newState));
// });
