import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';
import GlobalText from './GlobalText';

const styles = StyleSheet.create({
  floatingBadge: {
    flex: 1,
    maxWidth: '86%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: theme.gutters.paddingSM + 2,
    left: theme.gutters.paddingSM + 2,
    paddingVertical: theme.gutters.paddingXXS,
    paddingHorizontal: theme.gutters.paddingXS,
    backgroundColor: theme.colors.labelPrimary,
    borderRadius: theme.borderRadius.borderRadiusSM,
  },
  badgeNumber: {
    marginLeft: theme.gutters.paddingXS,
  },
});

const GlobalFloatingBadge = ({ title, number }) => (
  <View style={styles.floatingBadge}>
    {title && (
      <GlobalText type="caption" color="bgLight" numberOfLines={1}>
        {title}
      </GlobalText>
    )}
    {number && (
      <GlobalText
        type="caption"
        color="bgLight"
        style={title && styles.badgeNumber}>
        {number}
      </GlobalText>
    )}
  </View>
);
export default GlobalFloatingBadge;
