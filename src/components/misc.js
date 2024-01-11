import { Text, View } from "react-native";

export function LoadingText({ text }) {
  return (
    <Text style={{ textAlign: "center", fontStyle: "italic", padding: 12 }}>
      {text}
    </Text>
  );
}

export function ErrorText({ text }) {
  return (
    <Text style={{ textAlign: "center", fontWeight: "bold", padding: 12, color: "red" }}>
      {text}
    </Text>
  );
}

export function ErrorMsg({ text }) {
  return (
    <Text style={{ textAlign: "center", padding: 12, color: "hsl(0, 59%, 54%)", padding: 12 }}>
      Error: {text}
    </Text>
  );
}
