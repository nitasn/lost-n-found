import { Animated, StyleSheet, TouchableOpacity, View, Text, Easing } from "react-native";

import { useRef, useState, useEffect } from "react";

import { primaryColor } from "../js/theme";
import globalStyles from "../js/globalStyles";
import { createGlobalState, useGlobalState } from "../js/useGlobalState";

/**
 * @typedef {Object} AlertoProps
 * @property {string} [title]
 * @property {string} [message]
 */

const queueState = createGlobalState([]);

/**
 * @param {AlertoProps} props
 */
export default function alerto(props) {
  // todo allow props to be either { title, message } or string or React.JSX.Element!
  queueState.set([...queueState.get(), props]);
}

/**
 * @param {{ children: React.ReactNode }}  
 */
export function AlertoProvider({ children }) {
  return (
    <>
      {children}
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
  /** @type {[Array<AlertoProps>]} */
  const [queue, setQueue] = useGlobalState(queueState);

  const [anyAlertShown, setAnyAlertShown] = useState(false);

  const { current: opacity } = useRef(new Animated.Value(0));
  const { current: scale } = useRef(new Animated.Value(0));

  useEffect(() => {
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

  // todo
  // 1. WARNING: "Sending `onAnimatedValueUpdate` with no listeners registered"
  //    when i show the alert in PostPage, then dismiss, then hot-reload the app.

  return (
    <Animated.View style={[styles.fullScreenContainer, { opacity }]}>
      <AlertoBox alertoProps={queue[0]} doClose={closeAlerto} animatedValue={scale} />
    </Animated.View>
  );
}

/**
 * @param {{ alertoProps: AlertoProps, doClose: () => void }}
 */
function AlertoBox({ alertoProps, doClose, animatedValue }) {
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View style={[styles.alertoBox, { transform: [{ scale }] }]}>
      {alertoProps.title && <Text style={styles.title}>{alertoProps.title}</Text>}
      {alertoProps.message && <Text style={styles.message}>{alertoProps.message}</Text>}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={doClose}>
          <Text style={styles.actionBtnText}>Ok</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  message: {
    marginBottom: 12,
  },
  actionsRow: {
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
