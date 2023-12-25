import { StyleSheet, View } from "react-native";

/** <hr /> */
export default function Hr({ style }) {
  return <View style={[styles.hr, style]} />;
}

const styles = StyleSheet.create({
  hr: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
});
