import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { primaryColor } from "../js/theme";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function ButtonInSplashColor({ title, style, onPress }) {
  return (
    <TouchableOpacity style={[styles.wrap, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export function BigButtonInSplashColor({ title, iconName, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.buttonGo, style]} onPress={onPress}>
      <Text style={styles.buttonGoText}>{title}</Text>
      {iconName && <Ionicons size={18} color="white" name={iconName} />}
    </TouchableOpacity>
  );
}

export function MinimalButtonInSplashColor({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Text style={styles.actionBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...globalStyles.shadow_2,
    backgroundColor: primaryColor,
    borderRadius: 5,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: '600'
  },
  buttonGo: {
    marginTop: 20,
    minHeight: 40,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 5,
    ...globalStyles.shadow_3,
    backgroundColor: primaryColor,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonGoText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.1,
    color: "white",
  },
  // minimal button
  actionBtn: {
    margin: -25,
    padding: 25,
  },
  actionBtnText: {
    color: primaryColor,
    fontWeight: "600",
  },
});
