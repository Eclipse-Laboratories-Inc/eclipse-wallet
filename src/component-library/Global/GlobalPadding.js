import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';

const styles = StyleSheet.create({
  paddingXXS: {
    height: theme.gutters.paddingXXS,
  },
  paddingXS: {
    height: theme.gutters.paddingXS,
  },
  paddingSM: {
    height: theme.gutters.paddingSM,
  },
  paddingNormal: {
    height: theme.gutters.paddingNormal,
  },
  paddingMD: {
    height: theme.gutters.paddingMD,
  },
  paddingLG: {
    height: theme.gutters.paddingLG,
  },
  paddingXL: {
    height: theme.gutters.paddingXL,
  },
  padding2XL: {
    height: theme.gutters.padding2XL,
  },
  padding3XL: {
    height: theme.gutters.padding3XL,
  },
  padding4XL: {
    height: theme.gutters.padding4XL,
  },
});

const GlobalPadding = ({ size }) => (
  <View
    style={[
      size === 'xxs' && styles.paddingXXS,
      size === 'xs' && styles.paddingXS,
      size === 'sm' && styles.paddingSM,
      !size && styles.paddingNormal,
      size === 'md' && styles.paddingMD,
      size === 'lg' && styles.paddingLG,
      size === 'xl' && styles.paddingXL,
      size === '2xl' && styles.padding2XL,
      size === '3xl' && styles.padding3XL,
      size === '4xl' && styles.padding4XL,
    ]}
  />
);
export default GlobalPadding;
