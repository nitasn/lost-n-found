import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Feed";

import FilterPicker from "./FilterPicker";
import PostPage from "./PostPage";

import TypeContext from "../js/typeContext";
import { useContext, useState, useCallback } from "react";

export function FoundStack() {
  return (
    <TypeContext.Provider value="found">
      <FeedStack />
    </TypeContext.Provider>
  );
}

export function LostStack() {
  return (
    <TypeContext.Provider value="lost">
      <FeedStack />
    </TypeContext.Provider>
  );
}

const Stack = createStackNavigator();

/**
 * @typedef {Object} Region
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} latitudeDelta - inversely proportional to zoom level on latitude
 * @property {number} longitudeDelta - inversely proportional to zoom level on longitude
 */

/**
 * @typedef {Object} Filter
 * @property {string} [query]
 * @property {Date} [fromDate]
 * @property {Date} [untilDate]
 * @property {Region} [region]
 * @property {`${number} Km`} [radiusKm]
 */

export default function FeedStack() {
  const type = useContext(TypeContext);

  /** @type {[Filter]} */
  const [filter, setFilter] = useState({});

  const FilterPicker_withProps = useCallback(() => {
    return <FilterPicker filter={filter} setFilter={setFilter} />;
  }, [filter, setFilter]);

  const Feed_withProps = useCallback(() => {
    return <Feed filter={filter} />;
  }, [filter]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { textTransform: "capitalize" },
        headerBackTitleStyle: { textTransform: "capitalize" },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={Feed_withProps}
        options={{ headerTitle: `${type} items` }}
      />
      <Stack.Screen
        name="FilterPicker"
        component={FilterPicker_withProps}
        options={{
          headerTitle: `search ${type} items`,
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
