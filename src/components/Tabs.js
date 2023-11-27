import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FoundStack, LostStack } from "./FeedStack";

function ChatsStack() {
  return <View style={{ flex: 1 }} />;
}

function SettingsStack() {
  return <View style={{ flex: 1 }} />;
}

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
        tabBarActiveTintColor: '#6750a4',
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
        name="SettingsStack"
        component={SettingsStack}
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "settings-sharp" : "settings-outline"}
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
