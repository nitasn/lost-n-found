import { useContext, useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import FeedPost from "./FeedPost";
import SearchBar from "./SearchBar";

import { useAllPosts } from "../js/useAllPosts";
import TypeContext from "../js/typeContext";

/**
 * @typedef {Object} Filter
 * @property {string} text
 * @property {Object} dates
 * @property {Date} dates.from
 * @property {Date} dates.until
 * @property {Object} location
 * @property {[number, number]} location.latLong
 * @property {number} location.radiusKm
 */

function MessageNoResults() {
  return <Text>No results... 💔</Text>;
}

function MessageNoItems() {
  return <Text>No Items... 💔</Text>;
}

export default function Feed() {
  const type = useContext(TypeContext);
  const [allPosts] = useAllPosts();
  const posts = useMemo(
    () => allPosts.filter((obj) => obj.type === type),
    [allPosts]
  );

  const [filter, setFilter] = useState(null);

  const renderSearchBar = () => <SearchBar />;

  const EmptyListMessage = () => (
    <View style={styles.emptyListMessage}>
      {filter ? <MessageNoResults /> : <MessageNoItems />}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderSearchBar}
      ListEmptyComponent={EmptyListMessage}
      data={posts}
      renderItem={({ item }) => <FeedPost postData={item} />}
    />
  );
}

const styles = StyleSheet.create({
  emptyListMessage: {
    alignItems: "center",
    padding: 12,
    flex: 1,
  },
});
