import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

import "core-js/stable/atob"; // polly-fill for jwt-decode
import { jwtDecode } from "jwt-decode";
import ButtonInSplashColor from "./ButtonInSplashColor";
import { alerto } from "./Alerto";

export default function () {
  return (
    <View style={styles.container}>
      <Text>Alerto Test</Text>
      <ButtonInSplashColor
        title="Alerto"
        onPress={() => {
          alerto({ title: "A Notice", message: "Did you notice this notice my friend?" });
          setTimeout(() => {
            alerto({ message: "This message has no title." });
          }, 1000);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
});
