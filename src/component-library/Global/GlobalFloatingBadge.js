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
  floatingBadgeTop: {
    zIndex: 1,
    flex: 1,
    maxWidth: '86%',
    flexDirection: 'row',
    position: 'absolute',
    top: theme.gutters.paddingSM + 2,
    right: theme.gutters.paddingSM + 2,
    paddingVertical: theme.gutters.paddingXXS,
    paddingHorizontal: theme.gutters.paddingXS,
    backgroundColor: theme.colors.cards,
    borderRadius: theme.borderRadius.borderRadiusSM,
  },
  floatingBadgeTopDetail: {
    zIndex: 1,
    flex: 1,
    maxWidth: '86%',
    flexDirection: 'row',
    position: 'absolute',
    top: theme.gutters.paddingMD,
    right: theme.gutters.padding4XL,
    paddingVertical: theme.gutters.paddingXS,
    paddingHorizontal: theme.gutters.paddingXS,
    backgroundColor: theme.colors.cards,
    borderRadius: theme.borderRadius.borderRadiusSM,
  },
  floatingBadgeTopPrice: {
    zIndex: 1,
    flex: 1,
    maxWidth: '86%',
    minWidth: '19%',
    flexDirection: 'row',
    position: 'absolute',
    top: theme.gutters.padding4XL,
    right: theme.gutters.padding4XL,
    paddingVertical: theme.gutters.paddingXXS,
    paddingHorizontal: theme.gutters.paddingXS,
    backgroundColor: theme.colors.labelPrimary,
    borderRadius: theme.borderRadius.borderRadiusSM,
  },
  badgeNumber: {
    marginLeft: theme.gutters.paddingXS,
  },
});

const GlobalFloatingBadge = ({
  title,
  titleTop,
  titleTopDetail,
  titleTopPrice,
  number,
}) => (
  <>
    {titleTopDetail && (
      <View style={styles.floatingBadgeTopDetail}>
        <GlobalText type="caption" color="body2" numberOfLines={1}>
          {titleTopDetail}
        </GlobalText>
      </View>
    )}
    {titleTopPrice && (
      <View style={styles.floatingBadgeTopPrice}>
        <GlobalText type="caption" color="bgLight" numberOfLines={1}>
          {titleTopPrice}
        </GlobalText>
      </View>
    )}
    {titleTop && (
      <View style={styles.floatingBadgeTop}>
        <GlobalText type="caption" color="body2" numberOfLines={1}>
          {titleTop}
        </GlobalText>
      </View>
    )}
    {(title || number) && (
      <View style={styles.floatingBadge}>
        {title && (
          <GlobalText type="caption" color="bgLight" numberOfLines={1}>
            {title}
          </GlobalText>
        )}
        {number && (
          <GlobalText
            type="caption"
            color="tertiary"
            style={title && styles.badgeNumber}>
            {number}
          </GlobalText>
        )}
      </View>
    )}
  </>
);
export default GlobalFloatingBadge;
