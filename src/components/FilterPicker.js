import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Pressable,
  TouchableOpacity,
  Modal,
  ScrollView,
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
import { StatusBar } from "expo-status-bar";
import ModalWithShadow from "./ModalWithShadow";
import { colorSplash } from "../js/theme";

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

function latLongToText({ latitude, longitude }) {
  const N_S = latitude >= 0 ? "N" : "S";
  const E_W = longitude >= 0 ? "E" : "W";

  const lat = Math.abs(latitude).toFixed(4);
  const long = Math.abs(longitude).toFixed(4);

  return `${lat}° ${N_S}, ${long}° ${E_W}`;
}

function LocationInputWithX({ latLong, setLatLong }) {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.inputWithX}>
      <Pressable onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.textInput}
          value={latLong ? latLongToText(latLong) : ""}
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
      <ModalWithShadow visible={modalVisible} doClose={closeModal}>
        <LocationPicker
          doClose={closeModal}
          latLong={latLong}
          setLatLong={setLatLong}
        />
      </ModalWithShadow>
    </View>
  );
}

function RadiusKmInput({ visible, radiusKm, setRadiusKm }) {
  const { current: options } = useRef(["5 Km", "15 Km", "50 Km"]);

  useEffect(() => {
    setRadiusKm(visible ? radiusKm || "15 Km" : "");
  }, [visible]);

  return (
    <EnumPicker
      active={visible}
      options={options}
      checkedOption={radiusKm}
      setCheckedOption={setRadiusKm}
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
  const [latLong, setLatLong] = useState(filter.latLong || null);
  const [radiusKm, setRadiusKm] = useState(filter.radiusKm || "");

  const anyFilterPicked = Boolean(
    query || fromDate || untilDate || latLong || radiusKm
  );

  const onSubmit = () => {
    setFilter({
      ...(query && { query }),
      ...(fromDate && { fromDate }),
      ...(untilDate && { untilDate }),
      ...(latLong && { latLong }),
      ...(radiusKm && { radiusKm }),
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form && null}>
        <Text style={styles.label}>item description</Text>
        <TextInputWithX text={query} setText={setQuery} />

        <Text style={styles.label}>from date</Text>
        <DateInputWithX date={fromDate} setDate={setFromDate} />

        <Text style={styles.label}>until date</Text>
        <DateInputWithX date={untilDate} setDate={setUntilDate} />

        <Text style={styles.label}>{type} around</Text>
        <LocationInputWithX latLong={latLong} setLatLong={setLatLong} />

        <RadiusKmInput
          visible={!!latLong}
          radiusKm={radiusKm}
          setRadiusKm={setRadiusKm}
        />
      </View>

      <TouchableOpacity style={styles.buttonGo} onPress={onSubmit}>
        <Text style={styles.buttonGoText}>
          {anyFilterPicked ? "Search" : "Don't Filter"}
        </Text>
        <Ionicons size={18} color="white" name="search" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // justifyContent: "center",
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
    color: "black",
  },
  clearInputX: {
    position: "absolute",
    right: 20,
  },
  buttonGo: {
    marginTop: 20,
    minHeight: 40,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 5,
    ...globalStyles.shadow_2,
    backgroundColor: colorSplash,
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
