import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAsyncStorage(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        value && setData(JSON.parse(value));
      } catch (error) {
        console.error("useAsyncStorage getItem error:", error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  const updateStoredData = async (value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setData(value);
    } catch (error) {
      console.error("useAsyncStorage setItem error:", error.message);
    }
  };

  return [data, updateStoredData, loading];
}

/**
 * while the data is loading, fallback to stored cache.
 * the decorated hook must return `{ data, isLoading, error }`.
 * @param {(...args) => { data, isLoading, error }} useAsyncHook
 */
export function withLocalStorageFallback(useAsyncHook, storageKey) {
  return (...args) => {
    const { data, isLoading, error } = useAsyncHook(...args);
    const [storage, setStorage, readingStorage] = useAsyncStorage(storageKey);

    useEffect(() => {
      if (!data) return;
      setStorage(data);
    }, [data]);

    return {
      data: data ?? storage,
      isLoading: isLoading || (!data && readingStorage),
      error,
    };
  };
}
