import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";

import SearchBar from "./SearchBar";
import Post from "./Post";
import dummyPosts from "../js/dummyPosts.json";
import Feed from "./Feed";

function FoundStack() {
  return <Feed posts={dummyPosts}/>
  const post = dummyPosts[0];
  return (
    <View style={{ flex: 1 }}>
      <SearchBar />
      {dummyPosts.slice(1).map((postData, idx) => (
        <Post postData={postData} key={postData._id} />
      ))}
    </View>
  );
}
function LostStack() {
  return <View style={{ flex: 1 }} />;
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

const navRef = createNavigationContainerRef();

export default function Tabs() {
  const [routeName, setRouteName] = React.useState();

  return (
    <NavigationContainer
      // linking={linking}
      fallback={<Text>Loading...</Text>}
      ref={navRef}
      onReady={() => setRouteName(navRef.getCurrentRoute().name)}
      onStateChange={() => setRouteName(navRef.getCurrentRoute().name)}
    >
      <Nav.Navigator
        headerMode="screen"
        /**
         * float - Render a single header that stays at the top and animates as screens are changed.
         * screen - Each screen has a header attached to it and the header fades in and out together with the screen.
         * see https://reactnavigation.org/docs/stack-navigator/
         */
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
            headerTitle: "Found Items",
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
            headerTitle: "Lost Items",
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
            // tabBarStyle: (routeName === "ConversationScreen") && { display: "none" },
            // safeAreaInsets: { bottom: 0 },
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
    </NavigationContainer>
  );
}
