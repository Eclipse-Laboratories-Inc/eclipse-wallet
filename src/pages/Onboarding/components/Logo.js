import React from 'react';
import { StyleSheet } from 'react-native';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import AppIcon from '../../../assets/images/AppIcon.png';
import { style } from '@mui/system';

const styles = StyleSheet.create({
  appLogo: {
    width: 102,
    height: 102,
    margin: 'auto',
  },
  appLogoSm: {
    width: 48,
    height: 48,
    margin: 'auto',
  },
});

const Logo = ({ size }) => {
  const logoStyle = size === 'sm' ? styles.appLogoSm : styles.appLogo;
  return (
    <>
      <GlobalImage source={AppIcon} style={logoStyle} />
    </>
  );
};

export default Logo;
