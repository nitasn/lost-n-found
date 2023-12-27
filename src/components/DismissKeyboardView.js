import { View, TouchableWithoutFeedback, Keyboard } from "react-native";

/**
 * When touched, dissmiss the keyboard.
 */
export default function DismissKeyboardView({ children }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>{children}</View>
    </TouchableWithoutFeedback>
  );
}
