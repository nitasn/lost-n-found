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
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback, useContext, useRef, forwardRef, useMemo } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import TypeContext from "../js/typeContext";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../js/globalStyles";
import EnumPicker from "./EnumPicker";
import { colorSplash } from "../js/theme";
import LocationChooser from "./LocationChooser";

function UncontrolledTextInputWithX({ initialText, onChangeText }) {
  const inputRef = useRef(null);

  const setInputValue = useCallback(
    (text) => {
      if (Platform.OS === "web") {
        inputRef.current.value = text;
      } else {
        inputRef.current.setNativeProps({ text });
      }
    },
    [inputRef]
  );

  const clearText = useCallback(() => {
    setInputValue("");
    onChangeText("");
  }, [setInputValue, onChangeText]);

  useEffect(() => {
    setInputValue(initialText || "");
  }, [setInputValue]);

  return useMemo(
    () => (
      <View style={styles.inputWithX}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          onChangeText={onChangeText}
          placeholder="Enter keywords..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.clearInputX} onPress={clearText}>
          <Ionicons size={24} color="black" name="close-outline" />
        </TouchableOpacity>
      </View>
    ),
    [inputRef, onChangeText, clearText]
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

/**
 * @param {{ region: import("./FeedStack").Region | null }}
 */
export function LocationInputWithX({ region, setRegion }) {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.inputWithX}>
      <Pressable onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.textInput}
          value={region ? latLongToText(region) : ""}
          placeholder="Choose Location..."
          placeholderTextColor="gray"
          editable={false}
          pointerEvents="none"
        />
      </Pressable>

      <TouchableOpacity style={styles.clearInputX} onPress={() => setRegion(null)}>
        <Ionicons size={24} color="black" name="close-outline" />
      </TouchableOpacity>

      <Modal visible={modalVisible} onRequestClose={closeModal} animationType="fade">
        <LocationChooser doClose={closeModal} region={region} setRegion={setRegion} />
      </Modal>
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
  const [region, setRegion] = useState(filter.region || null);
  const [radiusKm, setRadiusKm] = useState(filter.radiusKm || "");

  const anyFilterPicked = Boolean(query || fromDate || untilDate || region || radiusKm);

  const onSubmit = () => {
    setFilter({
      ...(query && { query }),
      ...(fromDate && { fromDate }),
      ...(untilDate && { untilDate }),
      ...(region && { region }),
      ...(radiusKm && { radiusKm }),
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form && null}>
        <Text style={styles.label}>item description</Text>
        <UncontrolledTextInputWithX initialText={query} onChangeText={setQuery} />

        <Text style={styles.label}>from date</Text>
        <DateInputWithX date={fromDate} setDate={setFromDate} />

        <Text style={styles.label}>until date</Text>
        <DateInputWithX date={untilDate} setDate={setUntilDate} />

        <Text style={styles.label}>{type} around</Text>
        <LocationInputWithX region={region} setRegion={setRegion} />

        <RadiusKmInput visible={!!region} radiusKm={radiusKm} setRadiusKm={setRadiusKm} />
      </View>

      <TouchableOpacity style={styles.buttonGo} onPress={onSubmit}>
        <Text style={styles.buttonGoText}>{anyFilterPicked ? "Search" : "Don't Filter"}</Text>
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
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    color: "black",
    margin: 12,
    flex: 1,
    backgroundColor: "#ffffff",
    ...globalStyles.noInputOutline,
    ...globalStyles.shadow_1,
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
    ...globalStyles.shadow_3,
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
