import MorePage from "./MorePage";
import PostComposer from "../PostComposer/PostComposer";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function MoreStack() {
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
        name="MorePage"
        component={MorePage}
        options={{ headerTitle: "More" }}
      />
      <Stack.Screen
        name="PostComposer"
        component={PostComposer}
        options={{ headerTitle: "New Post" }}
      />
    </Stack.Navigator>
  );
}
