import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import LogInOutGoogle from "../login-social/LogInOutGoogle.js";
import { auth } from "../../firebase.config.js";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor } from "../js/theme.js";
import globalStyles from "../js/globalStyles.js";
import Hr from "./Hr.js";
import alerto from "./Alerto.js";
import { useNavigation } from "@react-navigation/native";

/**
 * @param {{ iconName: keyof typeof Ionicons.glyphMap }}
 */
function MenuItem({ iconName, text, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={primaryColor} />
      <Text style={styles.menuItemText}>{text}</Text>
      <Ionicons name="chevron-forward" size={24} color={primaryColor} />
    </TouchableOpacity>
  );
}

export default function MorePage() {
  const navigation = useNavigation();

  const onPressing = (type) => () => {
    if (!auth.currentUser) {
      return alerto({
        title: "To Upload, Please Sign In",
        message: "To upload posts, and to enable chat with other users, please sign in ❤️",
      });
    }
    navigation.navigate("PostComposer", { type });
  };
  return (
    <View style={styles.screen}>
      <View style={styles.menuItemsContainer}>
        <MenuItem iconName="earth-outline" text="Upload Found Item" onPress={onPressing("found")} />
        <MenuItem iconName="planet-outline" text="Upload Lost Item" onPress={onPressing("lost")} />
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
