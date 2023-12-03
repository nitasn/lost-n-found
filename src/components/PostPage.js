import { View, Text, StyleSheet } from "react-native";
import { useAllPosts } from "../js/useAllPosts";
import { useMemo } from "react";
import globalStyles from "../js/globalStyles";

export default function ({ route }) {
  const { id } = route.params;

  const [posts] = useAllPosts();
  /** @type {import("./FeedPost").PostData} */
  const post = useMemo(() => posts.find((obj) => obj._id == id), [posts, id]);

  return (
    <View style={styles.postPage}>
      <Text>Post Page.</Text>
      <Text>Post ID: {id}</Text>
      <Text>Post ID: {post.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  postPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  post: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
    ...globalStyles.shadow_3,
    marginTop: 0,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 16,
    fontSize: 30,
    textTransform: "capitalize",
    fontWeight: "bold",
    letterSpacing: 1.1,
  },
  text: {},
  imagesList: {
    padding: 12,
  },
  imageWrapper: {
    ...globalStyles.shadow_3,
    borderRadius: 5,
    marginEnd: 12,
  },
  imageWrapper_lastChild: {
    marginEnd: 24,
  },
  image: {
    width: 250,
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
});

function prettyDistance(proximityInKm) {
  if (proximityInKm >= 10) {
    return `${proximityInKm.toFixed(0)} km away`;
  }
  if (proximityInKm >= 1) {
    return `${proximityInKm.toFixed(1)} km away`;
  }
  if (proximityInKm <= 0.1) {
    return "near you";
  }
  return `${proximityInKm.toFixed(2)} km away`;
}
