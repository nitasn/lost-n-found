import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Easing,
  Button,
  Pressable,
} from "react-native";
import globalStyles from "../js/globalStyles";
import { createGlobalState, useGlobalState } from "../js/useGlobalState";
import { colorSplash } from "../js/theme";
import { useRef, useState, useEffect } from "react";

/**
 * @typedef {Object} AlertoProps
 * @property {string} title
 * @property {string} message
 */

const queueState = createGlobalState([]);

/**
 * @param {AlertoProps} props
 */
export function alerto(props) {
  queueState.set([...queueState.get(), props]);
}

export function AlertoProvider({ children }) {
  return (
    <>
      {children}
      <AlertoContainer />
    </>
  );
}

/**
 * @param {Animated.Value} value
 * @param {{ toValue: number }}
 */
async function animate(value, { toValue }) {
  return new Promise((resolve) => {
    Animated.timing(value, {
      toValue: toValue,
      duration: 400,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start(({ finished }) => {
      finished && resolve();
    });
  });
}

function AlertoContainer() {
  /** @type {[Array<AlertoProps>]} */
  const [queue, setQueue] = useGlobalState(queueState);

  const [anyAlertShown, setAnyAlertShown] = useState(false);

  const { current: opacity } = useRef(new Animated.Value(0));

  useEffect(() => {
    if (!anyAlertShown && queue.length > 0) {
      setAnyAlertShown(true);
      animate(opacity, { toValue: 1 });
    }
  }, [queue]);

  if (queue.length === 0) return null;

  const closeAlerto = () => {
    animate(opacity, { toValue: 0 }).then(() => {
      setQueue(queue.slice(1));
      if (queue.length > 1) {
        animate(opacity, { toValue: 1 });
      } else {
        setAnyAlertShown(false);
      }
    });
  };

  return (
    <Animated.View style={[styles.fullScreenContainer, { opacity }]}>
      <AlertoBox alertoProps={queue[0]} doClose={closeAlerto} />
    </Animated.View>
  );
}

/**
 * @param {{ alertoProps: AlertoProps, doClose: () => void }}
 */
function AlertoBox({ alertoProps, doClose }) {
  return (
    <View style={styles.alertoBox}>
      <Text style={styles.title}>{alertoProps.title}</Text>
      <Text style={styles.message}>{alertoProps.message}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={doClose}>
          <Text style={styles.actionBtnText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    width: "75%",
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
  },
  actionBtnText: {
    color: colorSplash,
    fontWeight: "600",
  },
});
