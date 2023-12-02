import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Pressable,
  TouchableOpacity,
  Modal,
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
        <Ionicons size={24} color="black" name="close-outline" />
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
        <Ionicons size={24} color="black" name="close-outline" />
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
          <Ionicons size={24} color="black" name="close-outline" />
        </TouchableOpacity>
      </View>
      {/* <Modal
        animationType="fade"
        transparent={false}
        visible={open}
        onRequestClose={() => setOpen(false)}
      > */}
      <LocationPicker
        open={open}
        setOpen={setOpen}
        latLong={latLong}
        setLatLong={setLatLong}
      />
      {/* </Modal> */}
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

export default function FilterPicker({ filter, setFilter }) {
  const type = useContext(TypeContext);
  const navigation = useNavigation();

  const [query, setQuery] = useState(filter.query || "");
  const [fromDate, setFromDate] = useState(filter.fromDate || null);
  const [untilDate, setUntilDate] = useState(filter.untilDate || null);
  const [aroundLatLong, setAroundWhere] = useState(filter.aroundWhere || null);
  const [radiusKm, setRadiusKm] = useState(filter.radiusKm || 0);

  const anyFilterPicked = Boolean(
    query || fromDate || untilDate || aroundLatLong || radiusKm
  );

  const onSubmit = () => {
    setFilter({
      ...(query && { query }),
      ...(fromDate && { fromDate }),
      ...(untilDate && { untilDate }),
      ...(aroundLatLong && { aroundWhere: aroundLatLong }),
      ...(radiusKm && { radiusKm }),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 
        the .form is disabled because it breaks the locationPicker
      */}
      {/* <View style={styles.form}> */}
      <Text style={styles.label}>item description</Text>
      <TextInputWithX text={query} setText={setQuery} />

      <Text style={styles.label}>from date</Text>
      <DateInputWithX date={fromDate} setDate={setFromDate} />

      <Text style={styles.label}>until date</Text>
      <DateInputWithX date={untilDate} setDate={setUntilDate} />

      <Text style={styles.label}>{type} around</Text>
      <LocationInputWithX latLong={aroundLatLong} setLatLong={setAroundWhere} />

      <RadiusKmInput
        visible={!!aroundLatLong}
        radiusKm={radiusKm}
        setRadiusKm={setRadiusKm}
      />
      {/* </View> */}

      <TouchableOpacity style={styles.buttonGo} onPress={onSubmit}>
        <Text style={styles.buttonGoText}>
          {anyFilterPicked ? "Search" : "Don't Filter"}
        </Text>
        <Ionicons size={18} color="white" name="search" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    marginBottom: "auto",
    fontSize: 18,
  },
  form: {
    padding: 10,
    borderRadius: 5,
    ...globalStyles.shadow_2,
    backgroundColor: "white",
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
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 5,
  },
  clearInputX: {
    position: "absolute",
    right: 20,
  },
  buttonGo: {
    marginTop: 36,
    minHeight: 40,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 5,
    ...globalStyles.shadow_2,
    backgroundColor: "#333333a0",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonGoText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.1,
    color: "white",
  },
});

function formatDate(date) {
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0 :/
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
