import Constants from 'expo-constants';
export const deviceName = Constants.deviceName;

export function prettyDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function prettyDateNoWeekday(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
    if (typeof timestamp === 'string') timestamp = new Date(timestamp);
    if (typeof reference === 'string') reference = new Date(reference);
    const elapsed = Number(timestamp) - Number(reference);

    for (const unit in units) {
      if (Math.abs(elapsed) > units[unit] || unit == 'second') {
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

export const capitalize = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(capitalizeWord)
    .join(' ');
};

export const capitalizeWord = (word) => word[0].toUpperCase() + word.slice(1);

/**
 *
 * @param {string} url
 * @param {Object} body
 * @param {string?} jwt
 */
export function sendPostReq(url, body, jwt = undefined) {
  const headers = { 'Content-Type': 'application/json' };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  return fetch(url, {
    headers,
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(body),
  });
}

export function extractFrom(obj, keys) {
  return keys.reduce((res, key) => {
    if (key in obj) res[key] = obj[key];
    return res;
  }, {});
}

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * a simple cacher for functions, which may be sync or async.
 * important: the cached function's argument(s) must be json-able.
 */
export const cache = (() => {
  const dict = Object.create(null);

  return function (func) {
    return function (...args) {
      const strArgs = JSON.stringify(args);
      if (!(strArgs in dict)) {
        dict[strArgs] = func(...args);
      }
      return dict[strArgs];
    };
  };
})();

export function lastOf(arr) {
  return arr[arr.length - 1];
}

export function zip(arr1, arr2) {
  if (arr1.length > arr2.length) {
    return [...arr2].map((y, idx) => [arr1[idx], y]);
  }
  return [...arr1].map((x, idx) => [x, arr2[idx]]);
}

export function hashCyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
