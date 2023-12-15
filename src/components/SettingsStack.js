import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import UncontrolledTextInput from "./UncontrolledTextInput";

export default function SettingsStack() {
  return (
    <View style={styles.container}>
      <Text>גבינה צהובה</Text>
      <UncontrolledTextInput
        onSubmitEditing={({ nativeEvent: { text } }) => {
          alert(text);
        }}
        placeholder="Type Shomething..."
        style={styles.input}
      />
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
  input: {
    marginVertical: 24,
  },
});
