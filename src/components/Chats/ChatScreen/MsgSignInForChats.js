import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { primaryColor } from "../../../js/theme";

export function LinkToSignIn() {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("MoreStack", {
      screen: "MorePage",
      params: {}, // todo pass obj to tell it to draw an arrow to the login buttons?
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>Sign In</Text>
    </TouchableOpacity>
  );
}

export default function MsgPleaseSignIn() {
  return (
    <View style={styles.screen}>
      <Text>To Chat, please </Text>
      <LinkToSignIn />
      <Text>!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    color: primaryColor,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
