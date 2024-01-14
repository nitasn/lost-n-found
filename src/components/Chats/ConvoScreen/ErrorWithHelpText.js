import { Text, View } from "react-native";
import { ErrorMsg } from "../../misc";

export default function ErrorWithHelpText({ text }) {
  return (
    <View style={{ padding: 12 }}>
      <ErrorMsg text={text} />
      <View style={{ gap: 8 }}>
        <Text>If the error persists, please contact us at lost.n.found.nitsan@gmail.com</Text>
        <Text>We will help you out to reach this person!</Text>
      </View>
    </View>
  );
}
