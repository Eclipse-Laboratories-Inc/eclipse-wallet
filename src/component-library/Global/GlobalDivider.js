import React from 'react';
import { StyleSheet } from 'react-native';

import GlobalImage from './GlobalImage';
import DividerM from '../../assets/images/DividerM.png';

const styles = StyleSheet.create({
  divider: {
    marginBottom: 32,
    width: 56,
    height: 8,
  },
});

const GlobalDivider = () => (
  <GlobalImage source={DividerM} style={styles.divider} />
);
export default GlobalDivider;
