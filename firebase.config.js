import { initializeAuth, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: process.env.firebase_authDomain,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.firebase_storageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
};

function getNativeAuth() {
  // making webpack shutup: the following functions are not available for web.
  const { getReactNativePersistence } = require("firebase/auth");
  const ReactNativeAsyncStorage = require("@react-native-async-storage/async-storage").default;

  const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
  return initializeAuth(app, { persistence });
}

export const app = initializeApp(firebaseConfig);

export const auth = Platform.OS === "web" ? getAuth(app) : getNativeAuth();

// https://firebase.google.com/docs/web/setup#available-libraries

// const firebaseConfig = {
//   apiKey:             process.env.firebase_apiKey,
//   authDomain:         process.env.firebase_authDomain,
//   projectId:          process.env.firebase_projectId,
//   storageBucket:      process.env.firebase_storageBucket,
//   messagingSenderId:  process.env.firebase_messagingSenderId,
//   appId:              process.env.firebase_appId,
// };
