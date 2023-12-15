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
import { addrToLatLong, getLocation, useLocationSample } from "../js/location";
import { colorSplash } from "../js/theme";

const usingGoogleMaps = Platform.OS !== "ios";

export default function ({ region, setRegion, doClose }) {
  const [text, setText] = useState("");

  // used internally until the user hits "OK",
  // then we setRegion(pinRegion)
  const [pinRegion, setPinRegion] = useState(region);

  const { current: loop } = useRef(new Animated.Value(0));
  const { current: once } = useRef(new Animated.Value(0));

  const [isMovingAround, setIsMovingAround] = useState(false);

  // hack because <MapView> also fires a 'regionChange' event on inital paint
  const [isFirstRender, setIsFirstRender] = useState(true);

  const moveToCurrentLocation = () => {
    getLocation()
      .then(moveTo)
      .catch((err) => {
        console.error("oopsie coudn't get user location", err);
      });
  };

  const moveTo = (latLong) => {
    const newPinRegion = {
      ...latLong,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    mapRef.current.animateToRegion(newPinRegion, 1000); // in milliseconds
    setPinRegion(newPinRegion);
  };

  const onAddressSearch = async () => {
    if (!text) return;
    try {
      const latLong = await addrToLatLong(text);
      moveTo(latLong);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    !pinRegion && moveToCurrentLocation();
  }, []);

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

  return (
    <View style={styles.locationPicker}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.btn} onPress={doClose}>
            <Ionicons size={28} color="gray" name="chevron-back" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Choose Location</Text>

          <TouchableOpacity style={styles.toCurrentLocationBtn} onPress={moveToCurrentLocation}>
            <Ionicons size={24} color="gray" name="navigate" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setRegion(pinRegion);
              doClose();
            }}
          >
            <Ionicons size={28} color={colorSplash} name="checkmark" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputsRow}>
          <TextInput
            placeholder="Search by Name..."
            style={styles.input}
            placeholderTextColor="gray"
            value={text}
            onChangeText={setText}
            onSubmitEditing={onAddressSearch}
            returnKeyType="search"
          />
        </View>
      </SafeAreaView>

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

      <Animated.View style={[styles.pinWrapper, pinAnimtedStyle]}>
        <Image source={require("../../assets/pin.png")} style={styles.pinImage} />
      </Animated.View>
    </View>
  );
}

const pinImgSize = 48;

const styles = StyleSheet.create({
  locationPicker: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flex: 1,
  },
  headerContainer: {
    ...globalStyles.shadow_3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    marginHorizontal: 12,

    // because `pointerEvents: "none"` doesn't work
    zIndex: -1,
  },
  headerTopRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {},
  inputsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    // borderWidth: 1,
    borderRadius: 5,
    color: "black",
    margin: 12,
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  toCurrentLocationBtn: {
    marginLeft: "auto",
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
