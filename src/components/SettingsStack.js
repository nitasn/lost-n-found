import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import LogInOutGoogle from "../login-social/LogInOutGoogle.js";
import { Ionicons } from "@expo/vector-icons";
import { colorSplash } from "../js/theme.js";
import globalStyles from "../js/globalStyles.js";
import Hr from "./Hr.js";

/**
 * @param {{ iconName: keyof typeof Ionicons.glyphMap }}
 */
function MenuItem({ iconName, text, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={colorSplash} />
      <Text style={styles.menuItemText}>{text}</Text>
      <Ionicons name="chevron-forward" size={24} color={colorSplash} />
    </TouchableOpacity>
  );
}

export default function () {
  return (
    <View style={styles.screen}>
      <View style={styles.menuItemsContainer}>
        <MenuItem iconName="earth-outline" text="Upload Found Item" />
        <MenuItem iconName="planet-outline" text="Upload Lost Item" />
      </View>
      <Hr style={styles.hr} />
      <LogInOutGoogle />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
  },
  h2: {
    fontSize: 24,
    marginVertical: 12,
  },
  hr: {
    marginVertical: 24,
  },
  menuItemsContainer: {
    gap: 12,
  },
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
