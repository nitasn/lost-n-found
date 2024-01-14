import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import LogInOutGoogle from "../login-social/LogInOutGoogle.js";
import { auth } from "../../firebase.config.js";
import Hr from "./Hr.js";
import alerto from "./Alerto.js";
import { useNavigation } from "@react-navigation/native";

import MenuItem from "./MenuItem.js";
import { useAuth } from "../login-social/login.js";

export default function MorePage() {
  const navigation = useNavigation();
  const [user] = useAuth();

  const onPressing = (type) => () => {
    navigation.navigate("PostComposer", { type });
  };

  return (
    <View style={styles.screen}>
      {!user && <MsgLogInFirst />}
      <LogInOutGoogle />
      <Hr style={styles.hr} />
      <View style={styles.menuItemsContainer}>
        <MenuItem
          iconName="earth-outline"
          text="Upload Found Item"
          onPress={onPressing("found")}
          disabled={!user}
        />
        <MenuItem
          iconName="planet-outline"
          text="Upload Lost Item"
          onPress={onPressing("lost")}
          disabled={!user}
        />
      </View>
    </View>
  );
}

const MsgLogInFirst = () => {
  return <Text style={styles.msgLogInFirst}>To Upload and to Chat, Please Sign In ❤️</Text>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
  },
  msgLogInFirst: {
    marginBottom: 16,
    color: "hsl(0, 0%, 15%)",
    textAlign: "center",
  },
  hr: {
    marginVertical: 24,
  },
  menuItemsContainer: {
    gap: 12,
  },
});
