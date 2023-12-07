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

const usingGoogleMaps = Platform.OS !== "ios";

export default function LocationPicker({ latLong, setLatLong, doClose }) {
  // used internally until the user hits "OK",
  // later we'll setLatLong(pinLatLong).
  const [pinLatLong, setPinLatLong] = useState(latLong);

  return (
    <View
      style={[styles.locationPicker, usingGoogleMaps && { overflow: "hidden" }]}
    >
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
        {...(pinLatLong && {
          initialCamera: {
            center: pinLatLong,
            zoom: 15,
            pitch: 0, // needed for android
            heading: 0, // needed for android
          },
        })}
        minZoomLevel={0}
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
          setLatLong(pinLatLong);
          doClose();
        }}
        style={styles.floatingBtn_OK}
      >
        <Text>Ok</Text>
        <Ionicons size={22} color="green" name="checkmark" />
      </FloatingButton>

      <FloatingButton style={styles.floatingBtn_CANCEL} onPress={doClose}>
        <Text>Discard</Text>
        <Ionicons size={22} color="red" name="close" />
      </FloatingButton>
    </View>
  );
}

const pinImgSize = 200;

const styles = StyleSheet.create({
  locationPicker: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
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
