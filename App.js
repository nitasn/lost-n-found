import "react-native-gesture-handler";
/**
 * WARNING
 * If you are building for Android or iOS, do not skip this step,
 * or your app may crash in production even if it works fine in development.
 * https://reactnavigation.org/docs/stack-navigator
 */

import { en, registerTranslation } from "react-native-paper-dates";
registerTranslation("en", en);

import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import Tabs from "./src/components/Tabs";
import { linking } from "./src/js/linking";
import { NavigationContainer } from "@react-navigation/native";
import { createNavigationContainerRef } from "@react-navigation/native";

const navRef = createNavigationContainerRef();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer linking={linking} ref={navRef}>
        <Tabs />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
