import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  noInputOutline: Platform.OS === 'web' ? { outlineStyle: 'none' } : {},
  shadow_2: {
    // iOS Shadow
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
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
