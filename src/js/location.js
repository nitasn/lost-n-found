import * as Location from "expo-location";
import { useEffect, useState } from "react";

Location.setGoogleApiKey(process.env.GOOGLE_MAPS_API_KEY);

const FIVE_MINUTES = 1000 * 60 * 5;

export async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw Error("location permissions were not granted"); // todo toast?
  }

  const lastKnownPosition = await Location.getLastKnownPositionAsync({
    maxAge: FIVE_MINUTES,
    requiredAccuracy: 1000, // within a thousand meters
  });

  const location =
    lastKnownPosition ||
    (await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Balanced, // within a hundred meters
    }));

  const { latitude, longitude } = location.coords;
  return { latitude, longitude };
}

/**
 * this hook does NOT re-render when the user moves;
 * it only re-renders when the promise resolves to either a location or an error.
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
