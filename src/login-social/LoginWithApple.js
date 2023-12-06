import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

import { useUser, User } from "./login-state";

async function login() {
  const [user, setUser] = useUser();
  const credentials = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  const { email, fullName } = credentials;
  setUser(credentials);
}

function onLoginFailed() {
  // todo toast
  Alert.alert(
    "Login failed... If the issue persists, try logging in using a different method."
  );
}

export default function () {
  const [user, setUser] = useUser();
  return (
    <View style={styles.container}>
      <Text>{"user: " + user}</Text>
      <Button title="click 1" onPress={() => setUser({ name: "nitsan" })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 64,
  },
});
