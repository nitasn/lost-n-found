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

function AlertoContainer() {
  /** @type {[Array<AlertoProps>]} */
  const [queue, setQueue] = useGlobalState(queueState);

  if (queue.length === 0) return null;

  return (
    <View style={styles.fullScreenContainer}>
      <AlertoBox initialProps={queue[0]} doClose={() => setQueue(queue.slice(1))} />
    </View>
  );
}

/**
 * @param {{ initialProps: AlertoProps, doClose: () => void }}
 */
function AlertoBox({ initialProps, doClose }) {
  const { current: props } = useRef(initialProps);
  return (
    <View style={styles.alertoBox}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.message}>{props.message}</Text>
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
