import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import UncontrolledTextInput from "./UncontrolledTextInput";

import SignInScreen from "./SignInScreen.js";
import * as React from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebase.config.js";

const { type, message } = WebBrowser.maybeCompleteAuthSession();
console.log("maybeCompleteAuthSession:", { type, message });

export default function () {
  const [userInfo, setUserInfo] = React.useState();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.firebase_iosClientId,
    androidClientId: process.env.firebase_androidClientId,
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
      } else {
        console.log("user not authenticated");
      }
    });
    return () => unsub;
  }, []);

  if (userInfo) {
    return <Text style={{ padding: 30 }}>{JSON.stringify(userInfo, null, 2)}</Text>;
  } else return <SignInScreen promptAsync={promptAsync} />;
}
