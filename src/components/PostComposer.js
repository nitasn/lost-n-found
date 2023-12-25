import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import { useEffect } from "react";

export default function PostComposer({ navigation, route }) {
  useEffect(() => {
    if (!["lost", "found"].includes(route.params?.type)) {
      navigation.goBack();
    }
  }, [route.params]);

  return (
    <View style={styles.screen}>
      <Text>Post Composer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
