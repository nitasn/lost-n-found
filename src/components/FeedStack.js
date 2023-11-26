import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Feed";

import { TransitionPresets } from "@react-navigation/stack";
import FilterPicker from "./FilterPicker";
import PostPage from "./PostPage";

export function FoundStack() {
  return <FeedStack type="found" />;
}

export function LostStack() {
  return <FeedStack type="lost" />;
}

const headerTitle_Center_Capitalize = {
  headerTitleAlign: "center",
  headerTitleStyle: { textTransform: "capitalize" },
};

const Stack = createStackNavigator();

/**
 * @param {{ type: 'lost' | 'found' }}
 */
export default function FeedStack({ type }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        initialParams={{ type }}
        options={{
          headerTitle: `${type} items`,
          ...headerTitle_Center_Capitalize,
        }}
      />
      <Stack.Screen
        name="FilterPicker"
        component={FilterPicker}
        initialParams={{ type }}
        options={{
          headerTitle: `search ${type} items`,
          ...headerTitle_Center_Capitalize,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="PostPage"
        component={PostPage}
        initialParams={{ type }}
        options={{
          headerTitle: `${type} item`,
          ...headerTitle_Center_Capitalize,
        }}
      />
    </Stack.Navigator>
  );
}
