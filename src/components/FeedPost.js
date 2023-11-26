import * as React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../js/globalStyles";
import { geoDistance, timeDeltaAsString } from "../js/utils";

/**
 * @typedef {Object} PostData
 * @property {string} _id
 * @property {'found'} type - Either 'lost' or 'found'.
 * @property {boolean} isStillAvailable
 * @property {string} title
 * @property {string} text
 * @property {string[]} picsUrls - Array of URLs for pictures related to the post.
 * @property {string} date - in ISO 8601 format.
 * @property {Location} location
 * @property {Author} author
 * @property {number} proximityInKm
 */

/**
 * @typedef {Object} Location
 * @property {number} lat
 * @property {number} long
 * @property {string} name
 */

/**
 * Represents the author of a post.
 * @typedef {Object} Author
 * @property {string} _id
 * @property {string} name
 * @property {string} profilePicUrl
 */

/** <hr /> */
function HR() {
  return (
    <View style={{ height: 1, marginHorizontal: 8, backgroundColor: "#ccc" }} />
  );
}

/**
 * @param {{postData: PostData}}
 */
export default function FeedPost({ postData }) {
  const navigation = useNavigation();
  const placeName = postData.location.name?.trim();
  const viewPost = () => navigation.navigate("PostPage", { id: postData._id });
  return (
    <Pressable style={styles.post} onPress={viewPost}>
      <View style={styles.header}>
        <Text style={styles.title}>{postData.title}</Text>
        <Text style={styles.text}>{postData.text}</Text>
      </View>
      <FlatList
        style={styles.imagesList}
        data={postData.picsUrls}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isLast = index + 1 === postData.picsUrls.length;
          return (
            <Pressable
              style={[
                styles.imageWrapper,
                isLast && styles.imageWrapper_lastChild,
              ]}
              onPress={viewPost}
            >
              <Image style={styles.image} source={{ uri: item }} />
            </Pressable>
          );
        }}
        keyExtractor={(url, idx) => `${idx}|${url}`}
      />
      <HR />
      <View style={styles.footer}>
        <Text>
          <Text>{prettyDistance(postData.proximityInKm)}</Text>
          <Text>{placeName && ` • ${placeName}`}</Text>
        </Text>
        <Text>{timeDeltaAsString(postData.date)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
