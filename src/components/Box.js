import { Button, Text, View } from "react-native";
import { useGlobalState } from "../js/global-state";

import { countState } from "../state";

export default function ({}) {
  const [count, setCount] = useGlobalState(countState);

  return (
    <View>
      <Text>The count is {count}</Text>
      <Button title="Add" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}
