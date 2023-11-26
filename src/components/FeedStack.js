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
const headerTitle_Center_Capitalize = {
  headerTitleAlign: "center",
  headerTitleStyle: { textTransform: "capitalize" },
};

const Stack = createStackNavigator();

export default function FeedStack() {
  const type = useContext(TypeContext);
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerTitle: `${type} items`,
          ...headerTitle_Center_Capitalize,
        }}
      />
      <Stack.Screen
        name="FilterPicker"
        component={FilterPicker}
        options={{
          headerTitle: `search ${type} items`,
          ...headerTitle_Center_Capitalize,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="PostPage"
        component={PostPage}
        options={{
          headerTitle: `${type} item`,
          ...headerTitle_Center_Capitalize,
        }}
      />
    </Stack.Navigator>
  );
}
