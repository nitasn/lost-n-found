import * as React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import FeedPost from "./FeedPost";
import SearchBar from "./SearchBar";

function EmptyListMessage() {
  return (
    <View style={styles.emptyListMessage}>
      <Text>Nothing's Here.</Text>
    </View>
  );
}

export default function Feed({ route }) {
  const { type, posts } = route.params;

  const renderSearchBar = () => <SearchBar />;

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
