import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import AppBackground from '../../assets/images/AppBackground.png';

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: -1,
    left: 0,
  },
});

const GlobalBackgroundImage = ({ children, ...props }) => (
  <ImageBackground source={AppBackground} style={styles.image} {...props}>
    {children}
  </ImageBackground>
);

export default GlobalBackgroundImage;
