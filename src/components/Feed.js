import { useContext, useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import FeedPost from "./FeedPost";
import SearchBar from "./SearchBar";

import { useAllPosts } from "../js/useAllPosts";
import TypeContext from "../js/typeContext";

function MessageNoResults() {
  return <Text>No results... 💔</Text>;
}

function MessageNoItems() {
  return <Text>No Items... 💔</Text>;
}

export default function Feed({ filter }) {
  const type = useContext(TypeContext);

  const [allPosts] = useAllPosts();

  const posts = useMemo(
    () => allPosts.filter((obj) => obj.type === type),
    [allPosts, type]
  );

  const filterOn = Object.keys(filter).length > 0;

  const renderSearchBar = () => <SearchBar filterOn={filterOn} />;

  const EmptyListMessage = () => (
    <View style={styles.emptyListMessage}>
      {filterOn ? <MessageNoResults /> : <MessageNoItems />}
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
