import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import AppBackground from '../../assets/images/AppBackground.png';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

const GlobalBackgroundImage = ({ children, ...props }) => (
  <ImageBackground source={AppBackground} style={styles.image} {...props}>
    {children}
  </ImageBackground>
);

export default GlobalBackgroundImage;
