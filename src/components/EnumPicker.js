import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

/**
 *
 * @param {{
 *   options: string[],
 *   checkedOption: string,
 *   setCheckedOption: (option :string) => void,
 *   title: string
 *   active: boolean
 * }}
 */
export default function EnumPicker({
  options,
  checkedOption,
  setCheckedOption,
  title,
  active,
}) {
  return (
    <View style={[styles.enumPicker, !active && styles.inactive]}>
      <Text style={styles.title}>{title}</Text>
      {options.map((option, idx) => (
        <TouchableOpacity
          style={[
            styles.optionWrapper,
            active && checkedOption == option && styles.checkedOption,
          ]}
          onPress={() => setCheckedOption(option)}
          key={idx}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  enumPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 0,
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  inactive: {
    opacity: 0.3,
    pointerEvents: "none"
  },
  optionWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  optionText: {
    color: "#333",
  },
  checkedOption: {
    backgroundColor: "#ddd",
    color: "black",
  },
});
