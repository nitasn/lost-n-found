import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FeedStack from "./FeedStack";


function FoundStack() {
  return <FeedStack type="found" />;
}

function LostStack() {
  return <FeedStack type="lost" />;
}

function ChatsStack() {
  return <View style={{ flex: 1 }} />;
}

function SettingsStack() {
  return <View style={{ flex: 1 }} />;
}

function NotFound() {
  return <View style={{ flex: 1 }} />;
}

const Nav = createBottomTabNavigator();

export default function Tabs() {

  return (
    
      <Nav.Navigator
        headerMode="screen"
        screenOptions={({ route }) => ({
          // don't show tab-bar icon for the not-found page
          tabBarButton: route.name === "NotFound" ? () => null : undefined,
        })}
      >
        <Nav.Screen
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

        <Nav.Screen
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

        <Nav.Screen
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

        <Nav.Screen
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

        <Nav.Screen
          name="NotFound"
          component={NotFound}
          options={{
            title: "Not Found",
            headerTitleAlign: "center",
          }}
        />
      </Nav.Navigator>
  );
}
