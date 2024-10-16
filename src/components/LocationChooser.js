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
  TextInput,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { addrToLatLong, getLocation } from "../js/location";
import { primaryColor } from "../js/theme";
import { StatusBar } from "expo-status-bar";

const usingGoogleMaps = Platform.OS !== "ios";
// const usingGoogleMaps = true;

export default function LocationChooser({ region, setRegion, doClose }) {
  // used by this component while it's open;
  // when user hits "OK", we setRegion(pinRegion) to alter parent's state.
  const [pinRegion, setPinRegion] = useState(region);

  ///////////////////////////////////////////////////////////
  ///              P I N   A N I M A T I O N              ///
  ///////////////////////////////////////////////////////////

  const { current: loop } = useRef(new Animated.Value(0));
  const { current: once } = useRef(new Animated.Value(0));

  const [isMovingAround, setIsMovingAround] = useState(false);

  // hack because <MapView> also fires a 'regionChange' event on inital paint
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

  const mapRef = useRef(null);

  ///////////////////////////////////////////////////////////
  ///     A N I M A T I N G   M A P   M O V E M E N T     ///
  ///////////////////////////////////////////////////////////

  const moveToCurrentLocation = () => {
    getLocation()
      .then(moveTo)
      .catch((err) => {
        console.error("oopsie couldn't get user location", err);
      });
  };

  const moveTo = (latLong) => {
    const newPinRegion = {
      ...latLong,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    const duration_ms = 1000;
    mapRef.current.animateToRegion(newPinRegion, duration_ms);
    setPinRegion(newPinRegion);
  };

  useEffect(() => {
    async function moveToCurrentLocationOnStart() {
      const location = await getLocation();
      location && !hasSearchedAddress.current && moveTo(location);
    }
    !pinRegion && moveToCurrentLocationOnStart();
  }, []);

  const hasSearchedAddress = useRef(false);

  const onAddressSearch = async ({ nativeEvent: { text } }) => {
    if (!text) return;
    try {
      hasSearchedAddress.current = true;
      const latLong = await addrToLatLong(text);
      latLong && moveTo(latLong);
    } catch (err) {
      console.error("addrToLatLong error:", err.message);
    }
  };

  const inputRef = useRef(null);

  const clearQuery = useCallback(() => {
    if (Platform.OS === "web") {
      inputRef.current.value = "";
    } else {
      inputRef.current.setNativeProps({ text: "" });
    }
  }, [inputRef]);

  return (
    <View style={styles.locationChooser}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={doClose}>
            <Ionicons size={28} color="gray" name="chevron-back" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Choose Location</Text>

          <TouchableOpacity style={styles.toCurrentLocationBtn} onPress={moveToCurrentLocation}>
            <Ionicons size={24} color="rgb(155, 35, 116)" name="navigate" />
          </TouchableOpacity>

          {pinRegion && (
            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => {
                setRegion(pinRegion);
                doClose();
              }}
            >
              <Ionicons size={28} color={primaryColor} name="checkmark" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            placeholder="Search by Name..."
            style={styles.input}
            placeholderTextColor="gray"
            onSubmitEditing={onAddressSearch}
            returnKeyType="search"
          />

          <TouchableOpacity style={styles.clearInputX} onPress={clearQuery}>
            <Ionicons size={24} color="gray" name="close-outline" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
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
          initialRegion={pinRegion}
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

        {/* todo make fallback for web using normal css animation */}
        {/* todo actually that's not the issue prob... why can't i scroll in the web */}
        <Animated.View style={[styles.pinWrapper, Platform.OS !== "web" && pinAnimtedStyle]}>
          <Image source={require("../../assets/pin3.png")} style={styles.pinImage} />
        </Animated.View>
      </View>
    </View>
  );
}

const pinImgSize = 52;

const styles = StyleSheet.create({
  locationChooser: {
    ...StyleSheet.absoluteFill,
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight ?? 50,
    ...globalStyles.shadow_1,
    zIndex: 1,
  },
  headerTopRow: {
    paddingHorizontal: 12,
    paddingRight: 16,
    paddingVertical: 10,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    position: "absolute",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    color: "black",
    margin: 12,
    flex: 1,
    backgroundColor: "#e0e0e0",
    ...globalStyles.noInputOutline,
  },
  clearInputX: {
    position: "absolute",
    right: 20,
  },
  backBtn: {
    marginRight: "auto",
  },
  toCurrentLocationBtn: {
    margin: -24,
    padding: 24,
  },
  okBtn: {
    margin: -24,
    padding: 24,
  },
  mapWrapper: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  pinWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    // center pin in x-axis
    marginLeft: -pinImgSize / 2,
    // make pin's top on point
    marginTop: -pinImgSize * 0.9367,
    opacity: 0.9,
    pointerEvents: "none",
  },
  pinImage: {
    width: pinImgSize,
    height: pinImgSize,
  },
});
