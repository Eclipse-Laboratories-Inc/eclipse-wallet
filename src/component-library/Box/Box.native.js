import React from 'react';
import { View } from 'react-native';

const Box = ({ children, px = 0, py = 0 }) => {
  return (
    <View
      style={{
        paddingHorizontal: px,
        paddingVertical: py,
      }}>
      {children}
    </View>
  );
};

export default Box;
