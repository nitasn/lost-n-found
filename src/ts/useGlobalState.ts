import { useState, useEffect } from "react";

export function createGlobalState<T>(initialValue?: T) {
  let value = initialValue;
  const subs = new Set<(value: T) => void>();

  function get(): T {
    return value;
  }

  function set(param: T | ((currentValue: T) => T)): void {
    const next = typeof param !== "function" ? param : (param as (currentValue: T) => T)(value);
    if (value !== next) {
      value = next;
      subs.forEach((callback) => callback(value));
    }
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
