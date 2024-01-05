import { View, TouchableWithoutFeedback, Keyboard } from "react-native";

/**
 * When touched, dissmiss the keyboard.
 */
export default function DismissKeyboardView({ children, style }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  );
}
