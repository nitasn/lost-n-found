import { Text } from "react-native";

export function LoadingText({ text }) {
  return (
    <Text style={{ textAlign: "center", fontStyle: "italic", padding: 12 }}>
      {text}
    </Text>
  );
}
