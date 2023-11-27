import { View, Text, TextInput, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { extractFields } from "../js/utils";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native";

const filterFields = [
  "query",
  "fromDate",
  "untilDate",
  "aroundLatLong",
  "radiusKm",
];

export default function FilterPicker({ filter, setFilter }) {
  //

  const [query, setQuery] = useState(filter.query || "");
  const [fromDate, setFromDate] = useState(filter.fromDate || null);
  const [untilDate, setUntilDate] = useState(filter.untilDate || null);
  const [aroundLatLong, setAroundWhere] = useState(filter.aroundWhere || null);
  const [radiusKm, setRadiusKm] = useState(filter.radiusKm || 0);

  const toFilterObject = () => ({
    ...(query && { query }),
    ...(fromDate && { fromDate }),
    ...(untilDate && { untilDate }),
    ...(aroundLatLong && { aroundLatLong }),
    ...(radiusKm && { radiusKm }),
  });

  return (
    <View style={styles.filterPicker}>
      <TextInput
        style={styles.textInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Enter keywords..."
        placeholderTextColor="gray"
      />
      <Button
        title="Update Filter"
        onPress={() => setFilter(toFilterObject())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterPicker: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  textInput: {
    margin: 12,
    height: 40,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 12,
    alignSelf: "stretch",
    borderRadius: 5,
  },
});
