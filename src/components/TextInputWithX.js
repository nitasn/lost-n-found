import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { useEffect, useCallback, useRef, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import globalStyles from "../js/globalStyles";

/**
 * An Uncontrolled InputText with Clear (x) Button at its End.
 * @param {{
 *   onChangeText: (string) => void,
 *   initlalText: string | undefined,
 *   placeholder: string | undefined,
 *   label:       string | undefined,
 *   multiline:  boolean | undefined
 * }}
 */
export function TextInputWithX({
  onChangeText,
  initlalText = "",
  placeholder,
  label,
  multiline = false,
}) {
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
    setInputValue(initlalText);
  }, [setInputValue]);

  return useMemo(
    () => (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.wrapper}>
          <TextInput
            ref={inputRef}
            style={[styles.input, multiline && styles.multilineInput]}
            onChangeText={onChangeText}
            placeholderTextColor="gray"
            {...(placeholder && { placeholder })}
            {...(multiline && {
              multiline: true,
              numberOfLines: 5,
            })}
          />
          <TouchableOpacity
            style={[styles.btnX, multiline && styles.multilineBtnX]}
            onPress={clearText}
          >
            <Ionicons size={24} color="black" name="close-outline" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [inputRef, onChangeText, clearText, placeholder, label]
  );
}

const styles = StyleSheet.create({
  label: {
    margin: 12,
    fontWeight: "bold",
    marginBottom: 0,
    textTransform: "capitalize",
  },
  wrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    color: "black",
    margin: 12,
    backgroundColor: "#ffffff",
    ...globalStyles.noInputOutline,
    ...globalStyles.shadow_1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  btnX: {
    position: "absolute",
    right: 20,
  },
  multilineBtnX: {
    top: 18,
  },
});
