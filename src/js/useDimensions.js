import * as React from 'react';
import { Dimensions } from 'react-native';

export default function useDimensions() {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    const fn = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener('change', fn);
    return () => subscription.remove();
  }, []);

  return dimensions;
}
