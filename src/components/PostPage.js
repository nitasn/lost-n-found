import { View, Text, StyleSheet } from "react-native";
import { useAllPosts } from "../js/useAllPosts";
import { useMemo } from "react";

export default function ({ route }) {
  const { id } = route.params;
  const [posts] = useAllPosts();
  /** @type {import("./FeedPost").PostData} */
  const post = useMemo(() => posts.find((obj) => obj._id == id), [posts, id]);

  return (
    <View style={styles.postPage}>
      <Text>Post Page.</Text>
      <Text>Post ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  postPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
