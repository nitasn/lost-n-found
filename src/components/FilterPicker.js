import { StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useContext, useRef } from "react";
import TypeContext from "../js/typeContext";
import EnumPicker from "./EnumPicker";
import LocationInputWithX from "./LocationInputWithX";
import TextInputWithX from "./TextInputWithX";
import { BigButtonInSplashColor } from "./ButtonInSplashColor";
import DateInputWithX from "./DateInputWithX";

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

  console.log('filter:', {
    ...(query && { query }),
    ...(fromDate && { fromDate }),
    ...(untilDate && { untilDate }),
    ...(region && { region }),
    ...(radiusKm && { radiusKm }),
  });

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
});
