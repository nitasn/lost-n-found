import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { createContext, useEffect, useState, Context, useContext } from "react";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useIdTokenAuthRequest as useGoogleIdTokenAuthRequest } from "expo-auth-session/providers/google";

import { auth } from "../../firebase.config.js";

maybeCompleteAuthSession();

const AuthContext = createContext([]);

export default function useAuthContextProvider() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const [_, googleResponse, googleDoPrompt] = useGoogleIdTokenAuthRequest({
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

  const doSignOut = () => {
    firebaseSignOut(auth).then(setUser);
  };

  // important: must create a new fn instance!
  const promptSignInWithGoogle = () => googleDoPrompt();

  const value = [user, promptSignInWithGoogle, doSignOut];

  return ({ children }) => <AuthContext.Provider value={value} children={children} />;
}

export function useAuth() {
  return useContext(AuthContext);
}
