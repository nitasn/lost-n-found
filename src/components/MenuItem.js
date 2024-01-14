import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor } from "../js/theme.js";
import globalStyles from "../js/globalStyles.js";

/**
 * @param {{ iconName: keyof typeof Ionicons.glyphMap }}
 */
export default function MenuItem({ iconName, text, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.menuItemDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={!disabled ? styles.icon.color : styles.iconDisabled.color}
      />
      <Text style={[styles.menuItemText, disabled && styles.menuItemTextDisabled]}>{text}</Text>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={!disabled ? styles.icon.color : styles.iconDisabled.color}
      />
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
  menuItemDisabled: {
    backgroundColor: "rgb(229, 229, 229)",
  },
  menuItemTextDisabled: {
    color: "rgb(171, 171, 171)",
  },
  menuItemText: {
    marginRight: "auto",
  },
  icon: {
    color: primaryColor,
  },
  iconDisabled: {
    color: "rgb(171, 171, 171)",
  },
});
