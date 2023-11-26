import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Feed";

import { TransitionPresets } from "@react-navigation/stack";
import FilterPicker from "./FilterPicker";
import PostPage from "./PostPage";

import TypeContext from "../js/typeContext";
import { useContext } from "react";

export function FoundStack() {
  return <TypeContext.Provider value="found" children={<FeedStack />} />;
}

export function LostStack() {
  return <TypeContext.Provider value="lost" children={<FeedStack />} />;
}

const Stack = createStackNavigator();

export default function FeedStack() {
  const type = useContext(TypeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { textTransform: "capitalize" },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ headerTitle: `${type} items` }}
      />
      <Stack.Screen
        name="FilterPicker"
        component={FilterPicker}
        options={{
          headerTitle: `search ${type} items`,
          ...TransitionPresets.ModalFadeTransition,
        }}
      />
      <Stack.Screen
        name="PostPage"
        component={PostPage}
        options={{ headerTitle: `${type} item` }}
      />
    </Stack.Navigator>
  );
}
