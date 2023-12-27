import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../js/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { primaryColor } from "../js/theme";

export default function SearchBar({ filterOn }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate("FilterPicker")}
    >
      <Text style={[styles.text, filterOn && styles.text_filterOn]}>
        {filterOn ? "Tap to View Filter" : "Search..."}
      </Text>
      <Ionicons size={20} color={primaryColor} name="search" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 9.5,
    marginVertical: 11,
    marginTop: 13,
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
  text_filterOn: {
    fontWeight: "bold",
  },
});
