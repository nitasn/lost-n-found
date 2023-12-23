import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: process.env.firebase_authDomain,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.firebase_storageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // https://firebase.google.com/docs/web/setup#available-libraries

// const firebaseConfig = {
//   apiKey:             process.env.firebase_apiKey,
//   authDomain:         process.env.firebase_authDomain,
//   projectId:          process.env.firebase_projectId,
//   storageBucket:      process.env.firebase_storageBucket,
//   messagingSenderId:  process.env.firebase_messagingSenderId,
//   appId:              process.env.firebase_appId,
// };

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
