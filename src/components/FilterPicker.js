import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { extractFields } from "../js/utils";
import { useEffect, useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DatePickerModal } from "react-native-paper-dates";
import TypeContext from "../js/typeContext";
import { Ionicons } from "@expo/vector-icons";

const filterFields = [
  "query",
  "fromDate",
  "untilDate",
  "aroundLatLong",
  "radiusKm",
];

function TextInputWithX({ text, setText }) {
  return (
    <View style={styles.inputWithX}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Enter keywords..."
        placeholderTextColor="gray"
      />
      <TouchableOpacity style={styles.clearInputX} onPress={() => setText("")}>
        <Ionicons size={24} color="black" name="close-circle-outline" />
      </TouchableOpacity>
    </View>
  );
}

function DateInputWithX({ date, setDate }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.inputWithX} >
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          style={styles.textInput}
          value={date ? formatDate(date) : ""}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="gray"
          editable={false}
          pointerEvents="none"
        />
        </Pressable>
      <TouchableOpacity style={styles.clearInputX} onPress={() => setDate("")}>
        <Ionicons size={24} color="black" name="close-circle-outline" />
      </TouchableOpacity>

      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={date}
        onConfirm={({ date }) => {
          setOpen(false);
          setDate(date);
        }}
      />
    </View>
  );
}

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

  console.log(toFilterObject());

  return (
    <View style={styles.filterPicker}>
      <Text style={styles.label}>Search {type} items</Text>
      <TextInputWithX text={query} setText={setQuery} />

      <Text style={styles.label}>From date</Text>
      <DateInputWithX date={fromDate} setDate={setFromDate} />

      <Text style={styles.label}>Until date</Text>
      <DateInputWithX date={untilDate} setDate={setUntilDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    margin: 12,
    fontWeight: "bold",
    marginBottom: 0,
    textTransform: "capitalize",
  },
  filterPicker: {
    padding: 10,
  },
  inputWithX: {
    position: "relative",
    justifyContent: "center",
  },
  textInput: {
    margin: 12,
    height: 40,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  clearInputX: {
    position: "absolute",
    right: 20,
  },
});

function formatDate(date) {
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0 :/
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
