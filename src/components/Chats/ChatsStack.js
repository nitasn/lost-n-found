import ChatsScreen from "./ChatScreen/ChatsScreen";
import ConvoScreen from "./ConvoScreen/ConvoScreen";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function ChatsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { textTransform: "capitalize" },
        headerBackTitleStyle: { textTransform: "capitalize" },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{ headerTitle: "Chats" }}
      />
      <Stack.Screen
        name="ConvoScreen"
        component={ConvoScreen}
        options={{ headerTitle: "Conversation" }}
      />
    </Stack.Navigator>
  );
}
