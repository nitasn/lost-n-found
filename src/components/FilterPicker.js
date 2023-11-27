import { View, Text, TextInput, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { extractFields } from "../js/utils";
import { useEffect, useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DatePickerModal } from "react-native-paper-dates";
import { Button } from "react-native";
import TypeContext from "../js/typeContext";

const filterFields = [
  "query",
  "fromDate",
  "untilDate",
  "aroundLatLong",
  "radiusKm",
];

export default function FilterPicker({ filter, setFilter }) {
  const type = useContext(TypeContext);

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

  const [fromDateOpen, setFromDateOpen] = useState(false);

  const onDatePicked = (params) => {
    setFromDateOpen(false);
    setFromDate(params.date);
  };

  // onPress={() => setFilter(toFilterObject())}

  return (
    <View style={styles.filterPicker}>
      <Text style={styles.label}>Search {type} items</Text>
      <TextInput
        style={styles.textInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Enter keywords..."
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>From (any date)</Text>
      <Text style={styles.label}>To (any date)</Text>
      <Button title="Pick" onPress={() => setFromDateOpen(true)} />
      <DatePickerModal
        mode="single"
        visible={fromDateOpen}
        onDismiss={() => setFromDateOpen(false)}
        date={fromDate}
        onConfirm={onDatePicked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    margin: 12,
    fontWeight: "bold",
  },
  filterPicker: {
    // padding: 12,
  },
  textInput: {
    marginTop: 0,
    margin: 12,
    height: 40,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 12,
    alignSelf: "stretch",
    borderRadius: 5,
  },
});
