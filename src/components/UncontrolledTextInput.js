import { useCallback, useRef } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UncontrolledTextInput({ placeholder, onSubmitEditing, returnKeyType, style } = {}) {
  const inputRef = useRef(null);
  const textRef = useRef("");

  const clearQuery = useCallback(() => {
    if (Platform.OS === "web") {
      inputRef.current.value = "";
    } else {
      inputRef.current.setNativeProps({ text: "" });
    }
    textRef.current = "";
  }, [textRef, inputRef]);

  const onChangeText = useCallback((text) => (textRef.current = text), [textRef]);

  return (
    <View style={[styles.inputsRow, style]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        onChangeText={onChangeText}
        placeholderTextColor="gray"
        {...{ placeholder, onSubmitEditing, returnKeyType }}
      />
      <TouchableOpacity style={styles.clearInputX} onPress={clearQuery}>
        <Ionicons size={24} color="gray" name="close-outline" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputsRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    color: "black",
    backgroundColor: "#e0e0e0",
    flex: 1,
  },
  clearInputX: {
    position: "absolute",
    right: 10,
  },
});
