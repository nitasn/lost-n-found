import * as Location from "expo-location";
import { useEffect, useState } from "react";
import alerto from "../components/Alerto";

Location.setGoogleApiKey(process.env.GOOGLE_MAPS_API_KEY);

// import { PermissionsAndroid } from 'react-native';

// async function requestLocationPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: "Location Permission",
//         message: "This app needs access to your location to show the distance from lost/found items.",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK"
//       }
//     );

//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("Location permission granted");
//     } else {
//       console.log("Location permission denied");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }


const ONE_MINUTE = 1000 * 60 * 1;

/**
 * resolves to latLong object, or null on error.
 * @returns {Promise<{ latitude: number, longitude: number } | null>}
 */
export async function getLocation() {
  try {
    const perm = await Location.getForegroundPermissionsAsync();

    // todo alert BEFORE requesting...
    // also on android msg should be displayed when requesting location,
    // as demonstrated up in the file

    if (perm.status !== 'granted') {
      if (!perm.canAskAgain) {
        return null;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // todo this alerts on every load on web... disabled for now.
        // alerto({
        //   title: "Please Consider Permitting Location",
        //   message: "Location is used to tell you the distance from where items were lost/found",
        // });
        return null;
      }
    }  

    const lastKnownPosition = await Location.getLastKnownPositionAsync({
      maxAge: ONE_MINUTE,
      requiredAccuracy: 1000, // within a thousand meters
    });

    const location = lastKnownPosition || await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Balanced, // within a hundred meters
    });

    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  }
  catch (err) {
    console.error("can't get user location:", err.message);
    return null;
  }
}

/**
 * this hook does NOT re-render when the user moves;
 * it only resolves to a location object (or null) once.
 * @returns {{
 *   location: { latitude: number, longitude: number } | null,
 *   locationError: Error | null,
 *   locationLoading: boolean,
 * }}
 */
export function useLocationSample() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const locationLoading = !location && !locationError;

  useEffect(() => {
    let _mounted = true;
    getLocation()
      .then((latLong) => _mounted && setLocation(latLong))
      .catch((err) => _mounted && setLocationError(err));
    return () => (_mounted = false);
  }, []);

  return { location, locationError, locationLoading };
}

export async function addrToLatLong(address) {
  const [{ latitude, longitude }] = await Location.geocodeAsync(address);
  return { latitude, longitude };
}

export async function latLongToAddr({ latitude, longitude }) {
  const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
  return address;
}
