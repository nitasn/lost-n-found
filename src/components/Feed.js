import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Post from "./Post";
import SearchBar from "./SearchBar";

function EmptyListMessage() {
  return (
    <View style={styles.emptyListMessage}>
      <Text>Nothing's Here.</Text>
    </View>
  );
}

export default function Feed({ type, posts }) {
  const renderSearchBar = () => <SearchBar />;

  return (
    <View style={styles.feed}>
      <FlatList
        ListHeaderComponent={renderSearchBar}
        ListEmptyComponent={EmptyListMessage}
        data={posts}
        renderItem={({ item }) => <Post postData={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {},
  emptyListMessage: {
    alignItems: "center",
    padding: 12,
  }
});
