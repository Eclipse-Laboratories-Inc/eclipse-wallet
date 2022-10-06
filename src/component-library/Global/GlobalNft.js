import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import theme from './theme';
import GlobalImage from './GlobalImage';
import GlobalFloatingBadge from './GlobalFloatingBadge';

import { getMediaRemoteUrl } from '../../utils/media';
import { isCollection, isBlacklisted } from '../../utils/nfts';

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
    flexGrow: 1,
  },
});

const GlobalNft = ({ nft, onClick = () => {} }) => (
  <TouchableOpacity onPress={() => onClick(nft)} style={styles.touchable}>
    <View key={nft.url} style={styles.image}>
      <GlobalImage
        source={
          isBlacklisted(nft)
            ? 'https://payabl.com/storage/app/media/feature-blacklisted.png'
            : getMediaRemoteUrl(isCollection(nft) ? nft.thumb : nft.media)
        }
        size="block"
      />
      <GlobalFloatingBadge
        {...(isCollection(nft)
          ? { title: nft.collection, number: nft.length }
          : { title: nft.name })}
      />
    </View>
  </TouchableOpacity>
);
export default GlobalNft;
