import { StyleSheet, Text } from "react-native";

export default function Label({ text }) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    margin: 12,
    fontWeight: "bold",
    marginBottom: 0,
    textTransform: "capitalize",
  },
});
