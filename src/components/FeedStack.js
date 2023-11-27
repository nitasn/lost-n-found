import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Feed";

import { TransitionPresets } from "@react-navigation/stack";
import FilterPicker from "./FilterPicker";
import PostPage from "./PostPage";

import TypeContext from "../js/typeContext";
import { useContext, useState, useMemo, useCallback, useEffect } from "react";

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
 * @typedef {Object} Filter
 * @property {string} [query]
 * @property {Date} [fromDate]
 * @property {Date} [untilDate]
 * @property {[number, number]} [aroundLatLong]
 * @property {number} [radiusKm]
 */

export default function FeedStack() {
  const type = useContext(TypeContext);

  /** @type {[Filter]} */
  const [filter, setFilter] = useState({});

  const _FilterPicker = useCallback(() => {
    return <FilterPicker filter={filter} setFilter={setFilter} />;
  }, [filter, setFilter]);

  const _Feed = useCallback(() => {
    return <Feed filter={filter} />;
  }, [filter]);

  console.log("FeedStack rendered with filter:", filter);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { textTransform: "capitalize" },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={_Feed}
        options={{ headerTitle: `${type} items` }}
      />
      <Stack.Screen
        name="FilterPicker"
        component={_FilterPicker}
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
