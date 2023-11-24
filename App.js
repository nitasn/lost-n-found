import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React from "react";
import EverSpinningDots from "./src/components/EverSpinningDots";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text>Your content goes here</Text>
      <MyButton onPress={() => alert("bye")}>
        <Text>Pressy Here</Text>
        <EverSpinningDots style={styles.spinningDots} />
      </MyButton>
    </SafeAreaView>
  );
}

function MyButton({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.myButton}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // You can add additional styles here
  },
  myButton: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
    margin: 12,
  },
  spinningDots: {
    width: 20,
    height: 20,
  },
});
