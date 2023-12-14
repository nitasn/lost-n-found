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
import scopeCircle from "../../assets/scope-circle.png";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { getLocation } from "../js/location";
import { StatusBar } from "expo-status-bar";

const usingGoogleMaps = Platform.OS !== "ios";

export default function ({ region, setRegion, doClose }) {
  const [text, setText] = useState("");

  // used internally until the user hits "OK",
  // then we setRegion(pinRegion)
  const [pinRegion, setPinRegion] = useState(region);

  useEffect(() => {
    console.log(pinRegion);
  }, [pinRegion]);

  return (
    <View style={styles.locationPicker}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerInputs}>
          <TouchableOpacity style={[styles.btn, styles.btn_CANCEL]} onPress={doClose}>
            <Ionicons size={22} color="red" name="close" />
          </TouchableOpacity>

          <TextInput
            placeholder="Type Location..."
            style={styles.input}
            placeholderTextColor="gray"
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity
            style={[styles.btn, styles.btn_OK]}
            onPress={() => {
              setRegion(pinRegion);
              doClose();
            }}
          >
            <Ionicons size={22} color="green" name="checkmark" />
          </TouchableOpacity>
        </View>
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
        onRegionChangeComplete={setPinRegion}
        minZoomLevel={0}
        maxZoomLevel={17}
        showsCompass={false}
      />
      <View style={styles.pinWrapper}>
        <Image style={styles.pinImg} source={scopeCircle} />
      </View>
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
    flex: 1,
  },
  header: {
    ...globalStyles.shadow_3,
  },
  headerInputs: {
    padding: 12,
    gap: 12,
    flexDirection: "row",
    justifyContent: "stretch",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...globalStyles.shadow_3,
    borderRadius: 5,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 5,
    color: "black",
    flex: 1,
  },
  mapView: {
    flex: 1,
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
});
