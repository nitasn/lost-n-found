import * as Location from "expo-location";

Location.setGoogleApiKey(process.env.GOOGLE_MAPS_API_KEY);

const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * @returns {Promise<null | { latitude: number | null, longitude: number | null }>}
 */
export async function getLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("location permissions were not granted"); // todo toast?
      throw null;
    }

    const lastKnown = await Location.getLastKnownPositionAsync({
      maxAge: FIVE_MINUTES,
      requiredAccuracy: 1000, // within a thousand meters
    });

    const location = lastKnown || await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Balanced, // within a hundred meters
    })

    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  }
  catch {
    return null;
  }
};

export async function addrToLatLong(address) {
  const { latitude, longitude } = await Location.geocodeAsync(address);
  return { latitude, longitude };
};

export async function latLongToAddr({ latitude, longitude }) {
  const address = await Location.reverseGeocodeAsync({ latitude, longitude });
  return address;
};