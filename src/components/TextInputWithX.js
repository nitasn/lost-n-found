import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, memo } from "react";
import { Ionicons } from "@expo/vector-icons";

import globalStyles, { OnePixelWide } from "../js/globalStyles";
import Label from "./Label";

/**
 * An InputText with a Clear Button (x) at its End.
 * To make it uncontrolled, pass `initialText` without passing `text`.
 * To make it visual only, pass an `onPress` along with `editable={false}`.
 */
function TextInputWithX({
  text,
  onChangeText,
  initialText,
  placeholder,
  label,
  multiline,
  editable = true,
  onPress,
}) {
  const inputRef = useRef(null);

  const setInputValue = (text) => {
    if (Platform.OS === "web") {
      inputRef.current.value = text;
    } else {
      inputRef.current.setNativeProps({ text });
    }
  };

  useEffect(() => {
    initialText !== undefined && setInputValue(initialText);
  }, []);

  const clearText = () => {
    setInputValue("");
    onChangeText?.("");
  };

  return (
    <View>
      {label && <Label text={label} />}
      <Pressable style={styles.wrapper} {...(onPress && { onPress })}>
        <TextInput
          ref={inputRef}
          style={[styles.input, multiline && styles.multilineInput]}
          placeholderTextColor="gray"
          editable={editable}
          {...(onChangeText && { onChangeText })}
          {...(placeholder && { placeholder })}
          {...(text !== undefined && { value: text })}
          {...(multiline && {
            multiline: true,
            numberOfLines: 5,
          })}
          {...(onPress && { pointerEvents: "none" })}
        />
        <TouchableOpacity
          style={[styles.btnX, multiline && styles.multilineBtnX]}
          onPress={clearText}
        >
          <Ionicons size={24} color="black" name="close-outline" />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
}

export default memo(TextInputWithX, function areEqual(prevProps, nextProps) {
  /**
   * compare all props except 'initialText'
   */
  return (
    prevProps.text == nextProps.text &&
    prevProps.onChangeText == nextProps.onChangeText &&
    prevProps.placeholder == nextProps.placeholder &&
    prevProps.label == nextProps.label &&
    prevProps.multiline == nextProps.multiline &&
    prevProps.editable == nextProps.editable &&
    prevProps.onPress == nextProps.onPress
  );
});

const styles = StyleSheet.create({
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
    ...globalStyles.veryThinBorder,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  btnX: {
    position: "absolute",
    right: 20,
  },
  multilineBtnX: {
    top: 20,
  },
});
