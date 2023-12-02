import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

/**
 *
 * @param {{
 *   options: string[],
 *   checkedOption: string,
 *   setCheckedOption: (option :string) => void,
 *   title: string
 * }}
 */
export default function EnumPicker({
  options,
  checkedOption,
  setCheckedOption,
  title,
}) {
  return (
    <View style={styles.enumPicker}>
      <Text style={styles.title}>{title}</Text>
      {options.map((option, idx) => (
        <TouchableOpacity
          style={[
            styles.optionWrapper,
            option === checkedOption && styles.checkedOption,
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
    textTransform: 'capitalize'
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
