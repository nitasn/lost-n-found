import { View, Text } from "react-native";

export default function ({ route }) {
  const { postData } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Post Page.</Text>
      <Text>Post ID: {postData._id}</Text>
    </View>
  );
}