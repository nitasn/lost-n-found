import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from "firebase/auth";

import { createContext, useEffect, useState, Context, useContext, useCallback } from "react";
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../../firebase.config.js";

import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
WebBrowser.maybeCompleteAuthSession();

async function maybeSignUpOnServer(user) {
  return; // todo enable!

  // extract fields
  const _id = user.uid;
  const name = user.displayName;
  const email = user.email;
  const profilePicUrl = user.photoURL;

  // check if user is already known
  const oldJson = await AsyncStorage.getItem(`user:${_id}`);
  const newJson = JSON.stringify({ name, email, profilePicUrl });
  if (oldJson === newJson) return;

  // we've got a new user!
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${process.env.ServerUrl}/api/sign-up?token=${token}`);
  const json = await res.json();
  if (!res.ok) return console.error("could not sign up!", json);
  console.log("signed up :)", json);
  await AsyncStorage.setItem(`user:${_id}`, newJson);
}

const AuthContext = createContext([]);

function useWebPromptSignInWithGoogle() {
  return () => signInWithPopup(auth, new GoogleAuthProvider());
}

function useNativePromptSignInWithGoogle() {
  const [googleRequest, googleResponse, googleDoPrompt] = useGoogleIdTokenAuthRequest({
    iosClientId: process.env.firebase_iosClientId,
    androidClientId: process.env.firebase_androidClientId,
  });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
    // todo handle response types "cancel" and "error"
  }, [googleResponse]);

  // important: must create a new fn instance!
  return () => googleDoPrompt();
}

export default function useAuthContextProvider() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) return;
    maybeSignUpOnServer(user);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const promptSignInWithGoogle = Platform.select({
    web: useWebPromptSignInWithGoogle,
    native: useNativePromptSignInWithGoogle,
  })();

  const doSignOut = useCallback(() => {
    firebaseSignOut(auth).then(setUser);
  }, [setUser]);

  const value = [user, promptSignInWithGoogle, doSignOut];

  return ({ children }) => <AuthContext.Provider value={value} children={children} />;
}

export function useAuth() {
  return useContext(AuthContext);
}
