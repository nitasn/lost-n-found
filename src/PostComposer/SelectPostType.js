import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../js/globalStyles";

export default function SelectPostType({ type, setType }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>I've</Text>
      <TouchableOpacity
        style={styles.box}
        onPress={() => setType(type === "lost" ? "found" : "lost")}
      >
        <Text style={styles.boxText}>{type}</Text>
        <Ionicons name="chevron-down" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 12,
  },
  text: {
    fontSize: 32,
    fontWeight: "600",
    marginRight: 12,
  },
  box: {
    padding: 12,
    paddingVertical: 6,
    ...globalStyles.veryThinBorder,
    borderRadius: 5,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    ...globalStyles.shadow_1,
  },
  boxText: {
    fontSize: 32,
    fontWeight: "600",
  },
});
