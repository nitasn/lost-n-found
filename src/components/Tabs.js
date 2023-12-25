import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FoundStack, LostStack } from "./FeedStack";

import ChatsStack from "./ChatsStack";
import { colorSplash } from "../js/theme";
import MoreStack from "./MoreStack";

function NotFound() {
  return <View style={{ flex: 1 }} />;
}

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      headerMode="screen"
      screenOptions={({ route }) => ({
        // don't show tab-bar icon for the not-found page
        tabBarButton: route.name === "NotFound" ? () => null : undefined,
        tabBarActiveTintColor: colorSplash,
      })}
    >
      <Tab.Screen
        name="FoundStack"
        component={FoundStack}
        options={{
          title: "Found",
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "earth-sharp" : "earth"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="LostStack"
        component={LostStack}
        options={{
          title: "Lost",
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "planet-sharp" : "planet-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ChatsStack"
        component={ChatsStack}
        options={{
          title: "Chats",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MoreStack"
        component={MoreStack}
        options={{
          title: "More",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "add-circle-sharp" : "add-circle-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="NotFound"
        component={NotFound}
        options={{
          title: "Not Found",
          headerTitleAlign: "center",
        }}
      />
    </Tab.Navigator>
  );
}
