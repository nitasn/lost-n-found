import { View, Text } from "react-native";

export default function ({ route }) {
  const { id } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Post Page.</Text>
      <Text>Post ID: {id}</Text>
    </View>
  );
}