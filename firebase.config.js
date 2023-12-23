import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
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

export const app = initializeApp(firebaseConfig);

function getNativeAuth() {
  const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
  return initializeAuth(app, { persistence });
}

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
