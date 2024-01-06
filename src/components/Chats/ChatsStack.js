import ChatsScreen from "./ChatsScreen";
import ConversationScreen from "./ConversationScreen";

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
        name="ConversationScreen"
        component={ConversationScreen}
        options={{ headerTitle: "Conversation" }}
      />
    </Stack.Navigator>
  );
}
