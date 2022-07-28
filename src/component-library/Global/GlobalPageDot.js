import React from 'react';
import { StyleSheet } from 'react-native';

import GlobalImage from './GlobalImage';
import PaginationOn from '../../assets/images/PaginationOn.png';
import PaginationOff from '../../assets/images/PaginationOff.png';

const styles = StyleSheet.create({
  paginationDot: {
    margin: 10,
    width: 6,
    height: 6,
  },
});

const GlobalPageDot = ({ active }) => (
  <GlobalImage
    source={active ? PaginationOn : PaginationOff}
    style={styles.paginationDot}
  />
);
export default GlobalPageDot;
