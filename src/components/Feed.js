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
  const posts = useFilteredPosts(filter);

  const filterOn = Object.keys(filter).length > 0;

  const renderSearchBar = () => <SearchBar filterOn={filterOn} />;

  const EmptyListMessage = () => (
    <View style={styles.emptyListMessage}>{filterOn ? <MessageNoResults /> : <MessageNoItems />}</View>
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

/**
 * @param {import("./FeedStack").Filter} filter
 */
function useFilteredPosts(filter) {
  const type = useContext(TypeContext);

  /** @type {[[import("./FeedPost").PostData]]} */
  const [allPosts] = useAllPosts();

  const query = filter.query?.trim();
  const queryRegex = query && new RegExp(query, "i");

  const doesPostMatch = (post) => {
    if (post.type !== type) return false;

    if (post.date) {
      const postDate = new Date(post.date);
      if (filter.fromDate && filter.fromDate > postDate) return false;
      if (filter.untilDate && filter.untilDate < postDate) return false;
    }

    if (query && !queryRegex.test(post.title) && !queryRegex.test(post.text)) {
      return false;
    }

    // todo set post.proximityKm based on Haversine's getDistance from user's current location
    const filterRadius = parseInt(filter.radiusKm?.toString().match(/\d+/g)?.[0]);
    if (!isNaN(filterRadius) && filterRadius < post.proximityInKm) return false;

    return true;
  };

  const posts = useMemo(() => allPosts.filter(doesPostMatch), [type, filter, allPosts]);

  return posts;
}

const styles = StyleSheet.create({
  emptyListMessage: {
    alignItems: "center",
    padding: 12,
    flex: 1,
  },
});
