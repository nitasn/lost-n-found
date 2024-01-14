import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAsyncStorage<T>(key: string): [T, ((value: T) => Promise<void>), boolean] {
  const [data, setData] = useState<T>(null);
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

  const updateStoredData = async (value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setData(value);
    } catch (error) {
      console.error("useAsyncStorage setItem error:", error.message);
    }
  };

  return [data, updateStoredData, loading];
}

interface BaseAsyncHookResult<DataType> { 
  data?: DataType, 
  isLoading: boolean, 
  error?: Error
}

/**
 * while the data is loading, fallback to stored cache.
 * the decorated hook must return `{ data, isLoading, error }`.
 */
export function withLocalStorageFallback<DataType, Args extends any[], Ret>(
  useAsyncHook: (...args: Args) => Ret & BaseAsyncHookResult<DataType>,
  storageKey: string
) {
  return (...args: Args) => {
    const { data, isLoading, error, ...rest }: BaseAsyncHookResult<DataType> = useAsyncHook(...args);
    const [storage, setStorage, readingStorage] = useAsyncStorage<DataType>(storageKey);

    useEffect(() => {
      if (!data) return;
      setStorage(data);
    }, [data]);

    return {
      ...rest,
      data: data ?? storage,
      isLoading: isLoading || (!data && readingStorage),
      error,
    };
  };
}
