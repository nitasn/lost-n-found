import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { createContext, useEffect, useState, Context, useContext, useCallback } from "react";
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from "expo-auth-session/providers/google";

import { auth } from "../../firebase.config.js";

import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext([]);

function useWebPromptSignInWithGoogle() {
  // useEffect(() => {
  //   getRedirectResult(auth).then((result) => {
  //     if (!result) return;
  //     const { accessToken } = GoogleAuthProvider.credentialFromResult(result);
  //     console.log(accessToken);
  //   });
  // }, []);

  return () => signInWithRedirect(auth, new GoogleAuthProvider());
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
    console.log("we have a user!");
    const { accessToken } = user.stsTokenManager;
    console.log("accessToken:", accessToken);
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
