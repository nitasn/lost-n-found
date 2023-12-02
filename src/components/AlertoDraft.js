import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import globalStyles from "../js/globalStyles";
import { Ionicons } from "@expo/vector-icons";

function FloatingButton({ children, style, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.floatingBtnWrapper, style]}
      onPress={onPress}
    >
      <View style={styles.floatingBtn}>{children}</View>
    </TouchableOpacity>
  );
}

export default function ({ visible, setVisible }) {
  // this allows us to un-draw ourselves after the animation finishes
  const [shouldStillRender, setShouldStillRender] = useState(visible);

  const { current: animation } = useRef(new Animated.Value(0));

  const onAnimationStartedOrFinished = ({ finished }) => {
    if (finished) {
      setShouldStillRender(visible);
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 400,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start(onAnimationStartedOrFinished);
  }, [visible]);

  if (!visible && !shouldStillRender) return;

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const transformScale = { transform: [{ scale }] };

  return (
    <Animated.View style={[styles.outerWrap, { opacity }]}>
      <Animated.View style={[styles.innerWrap, transformScale]}>
        {/* todo content */}

        <FloatingButton
          onPress={() => {
            setVisible(false);
          }}
          style={styles.floatingBtn_OK}
        >
          <Text>Ok</Text>
          <Ionicons size={22} color="green" name="checkmark" />
        </FloatingButton>

        <FloatingButton
          style={styles.floatingBtn_CANCEL}
          onPress={() => setVisible(false)}
        >
          <Text>Discard</Text>
          <Ionicons size={22} color="red" name="close" />
        </FloatingButton>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  innerWrap: {
    flex: 1,
    borderRadius: 5,
    ...globalStyles.shadow_3,
  },

  floatingBtnWrapper: {
    position: "absolute",
    borderRadius: 5,
    ...globalStyles.shadow_3,
  },
  floatingBtn_OK: {
    right: 12,
    top: 12,
  },
  floatingBtn_CANCEL: {
    left: 12,
    top: 12,
  },
  floatingBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    overflow: "hidden",
    gap: 3,
  },
});
