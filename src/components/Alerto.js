import { Animated, StyleSheet, TouchableOpacity, View, Text, Easing } from "react-native";
import React from "react";

import { primaryColor } from "../js/theme";
import globalStyles from "../js/globalStyles";
import { createGlobalState, useGlobalState } from "../js/useGlobalState";

/**
 * @typedef {Object} TitleAndMessage
 * @property {string} [title]
 * @property {string} [message]
 *
 * @typedef {(closeAlerto: Function) => React.ReactNode} FuncReturningJsx
 *
 * @typedef {(TitleAndMessage | FuncReturningJsx | React.ReactNode | string)} AlertoArg
 */

const queueState = createGlobalState([]);

/**
 * **Argument Type**
 * 
 * Alerto accepts either a `string`, `{ title, message }`,
 * `JSX`, or a `function`.
 * 
 * `alerto("Hello World")`
 * 
 * `alerto({ title: "A Title", message: "This is a message." })`
 * 
 * `alerto(<MyComponent />)`
 *
 * `alerto((closeAlerto) => <ProgressBar onFinish={closeAlerto} />)`
 * 
 * **Note** 
 * 
 * If you pass a function (and only in that case), the default "Ok" button won't show;
 * hence, the user won't be able to close the alerto
 * unless you explicitly let them (e.g. by `<Button onPress={closeAlerto} />`)
 *
 * @param {AlertoArg} arg
 */
export default function alerto(arg) {
  queueState.set([...queueState.get(), arg]);
}

/**
 * @param {{ children: React.ReactNode }}
 */
export function AlertoProvider({ children }) {
  const memoizedChildren = React.useMemo(() => children, [children]);

  // The children are memoized to avoid this warnning:
  // WARNING: "Sending `onAnimatedValueUpdate` with no listeners registered".
  //
  // It's printed when navigating into an inner page within the stack-navigation
  // (that is nested in a bottom-tabs-navigation), then in there showing an alerto,
  // then trigerring expo's hot reload.

  // TOFIX: maybe there's an actual memory leak of event handlers not being unregistered.

  return (
    <>
      {memoizedChildren}
      <AlertoContainer />
    </>
  );
}

/**
 * @param {Animated.Value} opacity
 * @param {Animated.Value} scale
 * @param {{ to: number }}
 */
async function animate(opacity, scale, { to }) {
  return new Promise((resolve) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: to,
        duration: 100,
        easing: Easing.circle,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: to,
        friction: 7.5,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(resolve, 100);
  });
}

function AlertoContainer() {
  /** @type {[Array<AlertoArg>]} */
  const [queue, setQueue] = useGlobalState(queueState);

  const [anyAlertShown, setAnyAlertShown] = React.useState(false);

  const { current: opacity } = React.useRef(new Animated.Value(0));
  const { current: scale } = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    if (!anyAlertShown && queue.length > 0) {
      setAnyAlertShown(true);
      animate(opacity, scale, { to: 1 });
    }
  }, [queue]);

  if (queue.length === 0) return null;

  const closeAlerto = () => {
    animate(opacity, scale, { to: 0 }).then(() => {
      setQueue((queue) => {
        if (queue.length === 1) {
          setAnyAlertShown(false);
        } else {
          setTimeout(() => {
            // have a little delay between subsuqent alertos
            animate(opacity, scale, { to: 1 });
          }, 300);
        }
        return queue.slice(1);
      });
    });
  };

  return (
    <Animated.View style={[styles.fullScreenContainer, { opacity }]}>
      <AlertoBox arg={queue[0]} doClose={closeAlerto} animatedValue={scale} />
    </Animated.View>
  );
}

const INCLUDE_OK_BTN = true;
const EXCLUDE_OK_BTN = false;

function toAlertoBody(arg, closeAlerto) {
  if (typeof arg === "string") {
    const jsx = <Text style={styles.message}>{arg}</Text>;
    return [jsx, INCLUDE_OK_BTN];
  }

  if (React.isValidElement(arg)) {
    return [arg, INCLUDE_OK_BTN];
  }

  if (typeof arg === "function") {
    return [arg(closeAlerto), EXCLUDE_OK_BTN];
  }

  if (!arg.title || !arg.message) {
    const jsx = <Text style={styles.message}>{arg.title || arg.message}</Text>;
    return [jsx, INCLUDE_OK_BTN];
  }

  const jsx = (
    <View style={styles.containerTitleMessage}>
      {<Text style={styles.title}>{arg.title}</Text>}
      {<Text style={styles.message}>{arg.message}</Text>}
    </View>
  );
  return [jsx, INCLUDE_OK_BTN];
}

function AlertoBox({ arg, doClose, animatedValue }) {
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const [body, shouldIncludeOkBtn] = toAlertoBody(arg, doClose);

  return (
    <Animated.View style={[styles.alertoBox, { transform: [{ scale }] }]}>
      {body}
      {shouldIncludeOkBtn && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={doClose}>
            <Text style={styles.actionBtnText}>Ok</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    backgroundColor: "rgba(80, 80, 80, .25)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertoBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    ...globalStyles.shadow_2,
    width: "80%",
    maxWidth: 450,
  },
  containerTitleMessage: {
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    letterSpacing: 0.5,
  },
  message: {
    // fontSize: 15,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
  },
  actionBtn: {
    marginLeft: "auto",
    margin: -25,
    padding: 25,
  },
  actionBtnText: {
    color: primaryColor,
    fontWeight: "600",
  },
});
