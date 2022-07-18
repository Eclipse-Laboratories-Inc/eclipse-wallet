import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';
import GlobalImage from './GlobalImage';
import GlobalFloatingBadge from './GlobalFloatingBadge';

import { getMediaRemoteUrl } from '../../utils/media';

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
  },
});

const GlobalNft = ({ nft }) => (
  <View key={nft.url} style={styles.image}>
    <GlobalImage source={getMediaRemoteUrl(nft.image).url} size="block" />
    <GlobalFloatingBadge title={nft.name} number="18" />
  </View>
);
export default GlobalNft;
