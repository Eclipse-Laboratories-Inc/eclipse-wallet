import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import AppBackground from '../../assets/images/AppBackground.png';
import theme from './theme';

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    margin: 'auto',
    marginTop: 0,
    marginBottom: theme.variables.margin,
    top: 0,
    right: 0,
    bottom: -1,
    left: 0,
    maxWidth: theme.variables.mobileWidthXL,
    maxHeight: theme.variables.mobileHeightLG,
  },
});

const GlobalBackgroundImage = ({ children, ...props }) => (
  <ImageBackground source={AppBackground} style={styles.image} {...props}>
    {children}
  </ImageBackground>
);

export default GlobalBackgroundImage;
