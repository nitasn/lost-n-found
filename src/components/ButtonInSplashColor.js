import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colorSplash } from "../js/theme";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function ({ title, style, onPress }) {
  return (
    <TouchableOpacity style={[styles.wrap, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export function BigButtonInSplashColor({ title, iconName, onPress }) {
  return (
    <TouchableOpacity style={styles.buttonGo} onPress={onPress}>
      <Text style={styles.buttonGoText}>{title}</Text>
      {iconName && <Ionicons size={18} color="white" name={iconName} />}
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
    textAlign: "center",
  },
  buttonGo: {
    marginTop: 20,
    minHeight: 40,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 5,
    ...globalStyles.shadow_3,
    backgroundColor: colorSplash,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonGoText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.1,
    color: "white",
  },
});
