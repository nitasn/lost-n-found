import { useContext, useState, useMemo, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import FeedPost from "./FeedPost";
import SearchBar from "./SearchBar";

import { dispatchPostsFetch, useAllPosts, usePostsFetchState } from "../ts/posts";
import TypeContext from "../js/typeContext";
import { geoDistance } from "../js/utils";
import { LoadingText } from "./misc";

function MessageNoResults() {
  return <Text>No results... 💔</Text>;
}

function MessageNoItems() {
  return <Text>No Items... 💔</Text>;
}

export default function Feed({ filter }) {
  // todo pass filter in context

  const fetchingState = usePostsFetchState();

  const posts = useFilteredPosts(filter);

  const filterOn = Object.keys(filter).length > 0;

  const ListHeaderComponent = () => (
    <>
      <SearchBar filterOn={filterOn} />
      {fetchingState.initiator === "app" && <LoadingText text="Loading Posts..." />}
    </>
  );

  const EmptyListMessage = () => {
    if (fetchingState.isFetching) return null;

    return (
      <View style={styles.emptyListMessage}>
        {filterOn ? <MessageNoResults /> : <MessageNoItems />}
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={EmptyListMessage}
      data={posts}
      renderItem={({ item }) => <FeedPost postData={item} />}
      onRefresh={() => dispatchPostsFetch({ initiator: "user" })}
      refreshing={fetchingState.initiator === "user"}
      keyExtractor={(post) => post._id}
    />
  );
}

/**
 * @param {import("./FeedStack").Filter} filter
 * @param {Array<import("./FeedPost").PostData>} allPosts
 */
function useFilteredPosts(filter) {
  const type = useContext(TypeContext);
  const allPosts = useAllPosts();

  const query = filter.query?.trim();
  const queryRegex = query && new RegExp(query, "i");

  const filterRadius = parseInt(filter.radiusKm?.toString().match(/\d+/g)?.[0]);

  /** @type {(post: import("./FeedPost").PostData) => boolean} */
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

    if (filter.region && post.location?.latLong) {
      // we're passing the filter if post location is unspecified...
      const { latitude, longitude } = filter.region;
      const distance = geoDistance(...post.location.latLong, latitude, longitude);
      if (distance > filterRadius) return false;
    }

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
