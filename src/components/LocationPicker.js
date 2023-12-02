import MapView from "react-native-maps";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import scopeCircle from "../../assets/scope-circle.png";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

function FloatingButton({ children, style, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.floatingBtnWrapper, style]}
      onPress={onPress}
    >
      <View style={styles.floatingBtn}>{children}</View>
    </TouchableOpacity>
  );
}

const useGoogleMapsUnlessOnAppleDevice = Platform.OS !== "ios" && {
  provider: "google",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
};

export default function LocationPicker({ open, setOpen, latLong, setLatLong }) {
  // used internally until the user hits "OK",
  // then we set latLong to where the pin is.
  const [pinLatLong, setPinLatLong] = useState(
    latLong || {
      latitude: 32.086358,
      longitude: 34.849895,
    }
  );

  // this allows us to un-draw ourselves after the animation finishes
  const [shouldStillRender, setShouldStillRender] = useState(open);

  const { current: animation } = useRef(new Animated.Value(0));

  const onAnimationStartedOrFinished = ({ finished }) => {
    if (finished) {
      setShouldStillRender(open);
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 400,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start(onAnimationStartedOrFinished);
  }, [open]);

  if (!open && !shouldStillRender) return;

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const transformScale = { transform: [{ scale }] };

  return (
    <Animated.View style={[styles.container, { /**/ opacity /**/ }]}>
      <Animated.View style={[styles.locationPicker, /**/ transformScale /**/]}>
        <StatusBar translucent={true} />
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
          {...useGoogleMapsUnlessOnAppleDevice}
          initialCamera={{
            center: pinLatLong,
            zoom: 15,
          }}
          minZoomLevel={8}
          maxZoomLevel={15}
          showsCompass={false}
          onRegionChangeComplete={({ latitude, longitude }) => {
            setPinLatLong({ latitude, longitude });
          }}
        />
        <View style={styles.pinWrapper}>
          <Image style={styles.pinImg} source={scopeCircle} />
        </View>
        <FloatingButton
          onPress={() => {
            setLatLong({
              latitude: pinLatLong.latitude.toFixed(4),
              longitude: pinLatLong.longitude.toFixed(4),
            });
            setOpen(false);
          }}
          style={styles.floatingBtn_OK}
        >
          <Text>Ok</Text>
          <Ionicons size={22} color="green" name="checkmark" />
        </FloatingButton>

        <FloatingButton
          style={styles.floatingBtn_CANCEL}
          onPress={() => setOpen(false)}
        >
          <Text>Discard</Text>
          <Ionicons size={22} color="red" name="close" />
        </FloatingButton>
      </Animated.View>
    </Animated.View>
  );
}

const pinImgSize = 200;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  locationPicker: {
    flex: 1,
    borderRadius: 5,
    ...globalStyles.shadow_3,
  },
  mapView: {
    flex: 1,
    borderRadius: 5,
  },
  pinWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -pinImgSize / 2,
    marginLeft: -pinImgSize / 2,
    opacity: 0.3,
    pointerEvents: "none",
  },
  pinImg: {
    width: pinImgSize,
    height: pinImgSize,
  },
  floatingBtnWrapper: {
    position: "absolute",
    borderRadius: 5,
    ...globalStyles.shadow_3,
  },
  floatingBtn_OK: {
    right: 12,
    top: 12,
  },
  floatingBtn_CANCEL: {
    left: 12,
    top: 12,
  },
  floatingBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    overflow: "hidden",
    gap: 3,
  },
});
