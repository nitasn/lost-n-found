import Constants from "expo-constants";
export const deviceName = Constants.deviceName;

export function prettyDate(date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    minute: '2-digit',
    hour: '2-digit'
  });
}

/**
 * given a date (or a unix timestamp), returns a string like "2 days ago"
 */
export const timeDeltaAsString = (() => {
  const units = {
    year: 24 * 60 * 60 * 1000 * 365.24,
    month: (24 * 60 * 60 * 1000 * 365.24) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  /**
   * @param {number|Date|string} timestamp in the past or in the future
   * @param {number|Date|string} reference defaults to Date.now()
   */
  return (timestamp, reference = Date.now()) => {
    if (typeof timestamp === "string") timestamp = new Date(timestamp);
    if (typeof reference === "string") reference = new Date(reference);
    const elapsed = Number(timestamp) - Number(reference);

    for (const unit in units) {
      if (Math.abs(elapsed) > units[unit] || unit == "second") {
        const howMany = Math.abs(Math.round(elapsed / units[unit]));
        const countString = howMany === 1 ? `${howMany} ${unit}` : `${howMany} ${unit}s`;
        if (elapsed < 0) return `${countString} ago`;
        return `in ${countString}`;
      }
    }
  };
})();

/**
 * The Haversine Formula
 * @param {Number} lat1
 * @param {Number} lon1
 * @param {Number} lat2
 * @param {Number} lon2
 * @returns {Number}
 */
export function geoDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

export const newID = (() => {
  let current = 0;
  return () => {
    return current++;
  };
})();

export function extractFields(obj, keys) {
  return keys.reduce((res, key) => {
    if (key in obj) res[key] = obj[key];
    return res;
  }, {});
}

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export function prettyDistance(proximityInKm) {
  if (proximityInKm >= 10) {
    return `${proximityInKm.toFixed(0)} km away`;
  }
  if (proximityInKm >= 1) {
    return `${proximityInKm.toFixed(1)} km away`;
  }
  if (proximityInKm <= 0.1) {
    return "About Here";
  }
  return `${proximityInKm.toFixed(2)} km away`;
}
