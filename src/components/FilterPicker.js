import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback, useContext, useRef, useMemo } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import TypeContext from "../js/typeContext";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../js/globalStyles";
import EnumPicker from "./EnumPicker";
import { colorSplash } from "../js/theme";
import LocationInputWithX from "./LocationInputWithX";
import TextInputWithX from "./TextInputWithX";
import { BigButtonInSplashColor } from "./ButtonInSplashColor";

function DateInputWithX({ date, setDate, label }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TextInputWithX
        text={date ? formatDate(date) : ""}
        placeholder="DD/MM/YYYY"
        editable={false}
        onPress={() => setOpen(true)}
        label={label}
      />
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
    </>
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
      <TextInputWithX
        initialText={query}
        onChangeText={setQuery}
        label="item description"
        placeholder="Enter keywords..."
      />

      <DateInputWithX date={fromDate} setDate={setFromDate} label="from date" />

      <DateInputWithX date={untilDate} setDate={setUntilDate} label="until date" />

      <LocationInputWithX region={region} setRegion={setRegion} label={`${type} around`} />

      <RadiusKmInput visible={!!region} radiusKm={radiusKm} setRadiusKm={setRadiusKm} />

      <BigButtonInSplashColor
        title={anyFilterPicked ? "Search" : "Don't Filter"}
        onPress={onSubmit}
        iconName="search"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
