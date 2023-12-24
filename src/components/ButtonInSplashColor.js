import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colorSplash } from "../js/theme";
import globalStyles from "../js/globalStyles";

export default function ({ title, style, onPress }) {
  return (
    <TouchableOpacity style={[styles.wrap, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...globalStyles.shadow_2,
    backgroundColor: colorSplash,
    borderRadius: 5,
  },
  text: {
    color: "white",
  },
});
