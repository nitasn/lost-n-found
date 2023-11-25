import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Feed";

import dummyPosts from "../js/dummyPosts.json";

import { TransitionPresets } from "@react-navigation/stack";
import FilterPicker from "./FilterPicker";
import PostPage from "./PostPage";

const headerTitle_Center_Capitalize = {
  headerTitleAlign: "center",
  headerTitleStyle: { textTransform: "capitalize" },
};

const Stack = createStackNavigator();

/**
 * @param {{ type: 'lost' | 'found' }}
 */
export default function FeedStack({ type }) {
  const posts = dummyPosts.filter((post) => post.type === type);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        initialParams={{ type, posts }}
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
