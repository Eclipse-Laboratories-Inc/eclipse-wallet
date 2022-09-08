import React from 'react';
import { StyleSheet } from 'react-native';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import AppIcon from '../../../assets/images/AppIcon.png';

const styles = StyleSheet.create({
  appLogo: {
    width: 102,
    height: 102,
    margin: 'auto',
  },
});

const Logo = () => (
  <>
    <GlobalImage source={AppIcon} style={styles.appLogo} />
  </>
);

export default Logo;
