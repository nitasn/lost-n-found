import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

import "core-js/stable/atob"; // polly-fill for jwt-decode
import { jwtDecode } from "jwt-decode";

export default function () {
  return (
    <View style={styles.container}>
      <Text>Hi ma nish</Text>
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
});
