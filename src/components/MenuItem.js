import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor } from "../js/theme.js";
import globalStyles from "../js/globalStyles.js";

/**
 * @param {{ iconName: keyof typeof Ionicons.glyphMap }}
 */
export default function MenuItem({ iconName, text, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={primaryColor} />
      <Text style={styles.menuItemText}>{text}</Text>
      <Ionicons name="chevron-forward" size={24} color={primaryColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 5,
    ...globalStyles.shadow_1,
  },
  menuItemText: {
    marginRight: "auto",
  },
});
