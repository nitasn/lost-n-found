import { StyleSheet, View, TextInput, TouchableOpacity, Keyboard, Platform } from "react-native";
import globalStyles from "../../../js/globalStyles";
import { primaryColor } from "../../../js/theme";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import alerto from "../../Alerto";
import sendMessage from "../sendMessage";
import { ErrorWithHelpText } from "./ConvoScreen";

export default function BottomInputs({ myUid, theirUid }) {
  const [text, setText] = useState("");
  const inputRef = useRef();
  const [sending, setSending] = useState(false);

  const setInputText = (text) => {
    if (Platform.OS === "web") {
      inputRef.current.value = text;
    } else {
      inputRef.current.setNativeProps({ text });
    }
  };

  const onBtn = async () => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setInputText("");
    const error = await sendMessage(myUid, theirUid, msg);
    setSending(false);
    if (error) {
      setInputText(text); // tricky use of closures: that's the old `text`
      Keyboard.dismiss();
      console.log(error.message);
      return alerto(<ErrorWithHelpText text={`Error: ${error.message}`} />);
    }
  };

  return (
    <View style={bottom.bottomRow}>
      <TextInput multiline style={bottom.input} ref={inputRef} onChangeText={setText} />
      <TouchableOpacity style={bottom.btnSend} onPress={onBtn} disabled={sending}>
        <Ionicons color={primaryColor} size={24} name="send" />
      </TouchableOpacity>
    </View>
  );
}
const bottom = StyleSheet.create({
  bottomRow: {
    flexDirection: "row",
    marginTop: "auto",
    padding: 12,
    paddingTop: 0,
  },
  input: {
    ...Platform.select({
      ios: {
        paddingTop: 12,
        paddingBottom: 12,
      },
      android: {
        minHeight: 40,
      },
      web: {
        height: 32,
        paddingTop: 15,
        paddingBottom: 15,
        height: 48,
      },
    }),
    paddingLeft: 14,
    paddingRight: 48,
    borderRadius: 5,
    color: "black",
    ...globalStyles.noInputOutline,
    ...globalStyles.veryThinBorder,
    ...globalStyles.shadow_1,
    backgroundColor: "hsl(0, 0%, 84%)",
    flex: 1,
  },
  btnSend: {
    position: "absolute",
    right: 24,
    ...Platform.select({
      ios: {
        bottom: 19,
      },
      web: {
        alignSelf: "center",
      },
    }),
  },
});
