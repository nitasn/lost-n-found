import React from "react";

export function createGlobalState(initialValue = null) {
  let value = initialValue;
  const subs = new Set();

  function get() { return value; }

  function set(param) {
    value = (typeof param === "function") ? param(value) : param;
    subs.forEach((callback) => callback(value));
  }
  
  function subscribe(callback) {
    if (typeof callback !== "function") {
      return console.error("param `callback` must be a function");
    }
    subs.add(callback);
    return function unsubscribe() { subs.delete(callback); };
  }

  return { get, set, subscribe };
}

export function useGlobalState(globalState) {
  const [value, setValue] = React.useState(globalState.get);
  React.useEffect(() => globalState.subscribe(setValue), []);
  return [value, globalState.set];
}
