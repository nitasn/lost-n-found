import "react-native-gesture-handler";
/**
 * This has to be at the top. see:
 * https://reactnavigation.org/docs/stack-navigator
 */

import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en-GB", enGB);

import registerRootComponent from 'expo/build/launch/registerRootComponent';

import App from './src/components/App';

registerRootComponent(App);
