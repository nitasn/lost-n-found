import { useState, useEffect } from "react";

export function createGlobalState<T>(initialValue?: T) {
  let value = initialValue;
  const subs = new Set<(value: T) => void>();

  function get(): T {
    return value;
  }

  function set(param: T | ((prevValue: T) => T)): void {
    value = typeof param === "function" ? (param as (prevValue: T) => T)(value) : param;
    subs.forEach((callback) => callback(value));
  }

  type UnsubscribeFn = () => void;

  function subscribe(callback: (value: T) => void): UnsubscribeFn {
    if (typeof callback !== "function") {
      throw new Error("param `callback` must be a function");
    }
    subs.add(callback);
    return () => subs.delete(callback);
  }

  return { get, set, subscribe };
}

type GlobalState<T> = ReturnType<typeof createGlobalState<T>>;

export function useGlobalState<T>(globalState: GlobalState<T>): [T, GlobalState<T>["set"]] {
  const [value, setValue] = useState<T>(globalState.get);

  useEffect(() => {
    const unsubscribe = globalState.subscribe(setValue);
    return unsubscribe;
  }, [globalState]);

  return [value, globalState.set];
}
