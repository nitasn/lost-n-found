import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { extractFields } from "../js/utils";
import { useEffect, useState, useCallback, useContext, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DatePickerModal } from "react-native-paper-dates";
import TypeContext from "../js/typeContext";
import { Ionicons } from "@expo/vector-icons";
import LocationPicker from "./LocationPicker";
import globalStyles from "../js/globalStyles";
import EnumPicker from "./EnumPicker";

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
    <View style={styles.inputWithX}>
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

function LocationInputWithX({ latLong, setLatLong }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <View style={styles.inputWithX}>
        <Pressable onPress={() => setOpen(true)}>
          <TextInput
            style={styles.textInput}
            value={latLong ? `${latLong.latitude}° ${latLong.longitude}°` : ""}
            placeholder="Choose Location..."
            placeholderTextColor="gray"
            editable={false}
            pointerEvents="none"
          />
        </Pressable>
        <TouchableOpacity
          style={styles.clearInputX}
          onPress={() => setLatLong(null)}
        >
          <Ionicons size={24} color="black" name="close-circle-outline" />
        </TouchableOpacity>
      </View>
      <LocationPicker
        open={open}
        setOpen={setOpen}
        latLong={latLong}
        setLatLong={setLatLong}
      />
    </>
  );
}

function RadiusKmInput({ visible, radiusKm, setRadiusKm }) {
  const { current: options } = useRef(["5 Km", "15 Km", "50 Km"]);

  const [option, setOption] = useState("15 Km");

  if (!visible) return;

  return (
    <EnumPicker
      options={options}
      checkedOption={option}
      setCheckedOption={setOption}
      title="within"
    />
  );
}

function ActionButton({ style, children }) {
  return (
    <TouchableOpacity style={[styles.actionButton, style]}>
      {children}
    </TouchableOpacity>
  );
}

export default function FilterPicker({ filter, setFilter }) {
  const type = useContext(TypeContext);
  const navigation = useNavigation();

  const [query, setQuery] = useState(filter.query || "");
  const [fromDate, setFromDate] = useState(filter.fromDate || null);
  const [untilDate, setUntilDate] = useState(filter.untilDate || null);
  const [aroundLatLong, setAroundWhere] = useState(filter.aroundWhere || null);
  const [radiusKm, setRadiusKm] = useState(filter.radiusKm || 0);

  const anyFilterPicked =
    query || fromDate || untilDate || aroundLatLong || radiusKm;

  const toFilterObject = () => ({
    ...(query && { query }),
    ...(fromDate && { fromDate }),
    ...(untilDate && { untilDate }),
    ...(aroundLatLong && { aroundLatLong }),
    ...(radiusKm && { radiusKm }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterPicker}>
        {/*  */}

        {/* <View style={styles.actionButtons}>
          <ActionButton>
            <Ionicons size={18} color="gray" name="chevron-back" />
            <Text>Dismiss</Text>
          </ActionButton>

          <ActionButton>
            <Ionicons size={18} color="gray" name="trash-bin" />
            <Text>Clear All</Text>
          </ActionButton>
        </View> */}

        <View /** Main Content */>
          <Text style={styles.label}>item description</Text>
          <TextInputWithX text={query} setText={setQuery} />

          <Text style={styles.label}>from date</Text>
          <DateInputWithX date={fromDate} setDate={setFromDate} />

          <Text style={styles.label}>until date</Text>
          <DateInputWithX date={untilDate} setDate={setUntilDate} />

          <Text style={styles.label}>{type} around</Text>
          <LocationInputWithX
            latLong={aroundLatLong}
            setLatLong={setAroundWhere}
          />

          <RadiusKmInput
            visible={!!aroundLatLong}
            radiusKm={radiusKm}
            setRadiusKm={setRadiusKm}
          />
        </View>

        {/* <View style={styles.actionButtons}>
          <ActionButton>
            <Ionicons size={18} color="gray" name="search" />
            <Text>Search</Text>
          </ActionButton>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  filterPicker: {
    padding: 10,
    flex: 1,
    borderRadius: 5,
    ...globalStyles.shadow_2,
    backgroundColor: "white",
    maxHeight: 600,
    justifyContent: "space-between",
  },
  label: {
    margin: 12,
    fontWeight: "bold",
    marginBottom: 0,
    textTransform: "capitalize",
  },
  inputWithX: {
    position: "relative",
    justifyContent: "center",
  },
  textInput: {
    margin: 12,
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 5,
  },
  clearInputX: {
    position: "absolute",
    right: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    margin: 12,
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    ...globalStyles.shadow_2,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});

function formatDate(date) {
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0 :/
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
