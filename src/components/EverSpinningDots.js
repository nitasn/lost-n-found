import * as React from 'react';
import { Easing, Animated } from 'react-native';
import { Platform } from 'react-native';

import loadingImgUri from '../../assets/loading-dots.png';

export default function EverSpinningDots({ style }) {
  const { current: animation } = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
        // TODO does it spin forever on android?
      })
    ).start();
  }, []);

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      style={[style, { transform: [{ rotate }] }]}
      source={loadingImgUri}
    />
  );
}
