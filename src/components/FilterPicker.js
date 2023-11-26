import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";


export default function FilterPicker() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar style="dark" animated={true} />
      <Text>Filter Picker.</Text>
    </View>
  );
}
