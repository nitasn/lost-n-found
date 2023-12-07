import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsStack() {

  return (
    <View style={styles.container}>
      <Text>גבינה צהובה</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
