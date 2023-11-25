import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../js/globalStyles";

export default function SearchBar({ filterIsOn }) {
  // const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate("FilterPicker")}
    >
      <Text style={[styles.text, filterIsOn && styles.text_filterIsOn]}>
        {filterIsOn ? "Tap to View Filter" : "Search..."}
      </Text>
      <Ionicons size={20} color="black" name="search" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "white",
    borderRadius: 12,
    ...globalStyles.shadow_3,
  },
  text: {
    fontSize: 15,
    letterSpacing: 1.1,
  },
  text_filterIsOn: {
    fontWeight: "bold",
  },
});
