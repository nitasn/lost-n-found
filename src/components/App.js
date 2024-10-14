import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import Tabs from "./Tabs";
import { linking } from "../js/linking";
import { NavigationContainer } from "@react-navigation/native";
import { createNavigationContainerRef } from "@react-navigation/native";
import useAuthContextProvider from "../login-social/login";
import { AlertoProvider } from "./Alerto";
import { useTopLevelPostsPolling } from "../ts/posts";

const navRef = createNavigationContainerRef();

export default function App() {
  useTopLevelPostsPolling();
  const AuthContextProvider = useAuthContextProvider();

  return (
    <NavigationContainer linking={linking} ref={navRef}>
      <AlertoProvider>
        <SafeAreaView style={Platform.OS === "web" ? styles.outerWeb : styles.outerMobile}>
          <View style={Platform.OS === "web" ? styles.innerWeb : styles.innerMobile}>
            <StatusBar style="auto" />
            <AuthContextProvider>
              <Tabs />
            </AuthContextProvider>
          </View>
        </SafeAreaView>
      </AlertoProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  outerMobile: {
    flex: 1,
  },
  outerWeb: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    overflow: "hidden",
  },
  innerMobile: {
    flex: 1,
  },
  innerWeb: {
    flex: 1,
    maxWidth: 932,
    width: "100%",
  },
});
