import MapView from "react-native-maps";
import {
  SafeAreaView,
  Platform,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { getLocation } from "../js/location";

const usingGoogleMaps = Platform.OS !== "ios";

export default function ({ region, setRegion, doClose }) {
  const [text, setText] = useState("");

  // used internally until the user hits "OK",
  // then we setRegion(pinRegion)
  const [pinRegion, setPinRegion] = useState(region);

  const { current: loop } = useRef(new Animated.Value(0));
  const { current: once } = useRef(new Animated.Value(0));

  const [isMovingAround, setIsMovingAround] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const startPinAnimations = () => {
    Animated.parallel([
      Animated.spring(once, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(loop, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(loop, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  const stopPinAnimations = () => {
    Animated.parallel([
      Animated.timing(loop, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(once, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
      ,
    ]).start();
  };

  const pinAnimtedStyle = {
    transform: [
      {
        translateY: loop.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -9],
        }),
      },
      {
        scale: once.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
    transformOrigin: "bottom",
    opacity: once.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
  };

  useEffect(() => {
    if (!isFirstRender) {
      isMovingAround ? startPinAnimations() : stopPinAnimations();
    }
  }, [isMovingAround, isFirstRender]);

  return (
    <View style={styles.locationPicker}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.btn, styles.btn_CANCEL]} onPress={doClose}>
            <Ionicons size={26} color="gray" name="chevron-back" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Choose Location</Text>

          <TouchableOpacity
            style={[styles.btn, styles.btn_OK]}
            onPress={() => {
              setRegion(pinRegion);
              doClose();
            }}
          >
            <Ionicons size={26} color="green" name="checkmark" />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Type Place Name..."
          style={styles.input}
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
      </SafeAreaView>

      <MapView
        showsBuildings={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsScale={false}
        showsTraffic={false}
        showsUserLocation={false}
        options={{
          disableDefaultUI: true,
        }}
        style={styles.mapView}
        {...(usingGoogleMaps && {
          provider: "google",
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        })}
        region={pinRegion}
        onRegionChange={() => {
          isFirstRender ? setIsFirstRender(false) : setIsMovingAround(true);
        }}
        onRegionChangeComplete={(region) => {
          setIsMovingAround(false);
          setPinRegion(region);
        }}
        minZoomLevel={0}
        maxZoomLevel={17}
        showsCompass={false}
      />
      <Animated.View style={[styles.pinWrapper, pinAnimtedStyle]}>
        <Image source={require("../../assets/pin.png")} style={styles.pinImage} />
      </Animated.View>
    </View>
  );
}

const pinImgSize = 48;

const styles = StyleSheet.create({
  locationPicker: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flex: 1,
  },
  header: {
    ...globalStyles.shadow_3,
  },
  headerTitle: {
    fontSize: 22,
    // fontWeight: 900,
  },
  headerRow: {
    padding: 12,
    gap: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  input: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 5,
    color: "black",
    margin: 12,
  },
  mapView: {
    flex: 1,
  },
  pinWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -pinImgSize / 2,
    marginTop: -pinImgSize / 2,
    opacity: 0.9,
    pointerEvents: "none",
  },
  pinImage: {
    width: pinImgSize,
    height: pinImgSize,
  },
});
