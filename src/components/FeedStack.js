import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Feed";

import dummyPosts from "../js/dummyPosts.json";

import { TransitionPresets } from "@react-navigation/stack";
import FilterPicker from "./FilterPicker";
import PostPage from "./PostPage";

const Stack = createStackNavigator();

const fadeIn = ({ current }) => {
  const opacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  return {
    cardStyle: {
      opacity,
    },
  };
};

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
          headerTitleStyle: { textTransform: "capitalize" },
        }}
      />
      <Stack.Screen
        name="FilterPicker"
        component={FilterPicker}
        initialParams={{ type }}
        // options={{ cardStyleInterpolator: fadeIn }}
        // options={{ ...TransitionPresets.ModalFadeTransition }}
        options={{ ...TransitionPresets.FadeFromBottomAndroid }}
        // options={{ ...TransitionPresets.RevealFromBottomAndroid }}
      />
      <Stack.Screen
        name="PostPage"
        component={PostPage}
        initialParams={{ type }}
      />
    </Stack.Navigator>
  );
}
