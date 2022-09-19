import React from 'react';
import { Pressable } from 'react-native-web-hover';

const styleOpacity = {
  opacity: 0.8,
};

const Hoverable = ({ children, style, ...props }) => (
  <Pressable
    style={({ hovered }) => [...style, hovered && styleOpacity]}
    {...props}>
    {children}
  </Pressable>
);

export default Hoverable;
