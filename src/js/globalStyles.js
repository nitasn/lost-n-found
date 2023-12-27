import { Platform, StyleSheet } from "react-native";

export const OnePixelWide = Platform.select({
  web: 1 / (window.devicePixelRatio || 1),
  native: StyleSheet.hairlineWidth,
});

export default StyleSheet.create({
  noInputOutline: Platform.OS === "web" && { outlineStyle: "none" },
  veryThinBorder: {
    borderWidth: OnePixelWide,
    borderColor: "#ddd",
  },
  shadow_1: {
    // iOS Shadow
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    // Android Shadow
    elevation: 1,
    backgroundColor: "white",
  },
  shadow_2: {
    // iOS Shadow
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Android Shadow
    elevation: 2,
    backgroundColor: "white",
  },
  shadow_3: {
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // Android Shadow
    elevation: 3,
    backgroundColor: "white",
  },
  shadow_5: {
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android Shadow
    elevation: 5,
    backgroundColor: "white",
  },
});
