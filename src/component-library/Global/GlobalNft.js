import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import theme, { globalStyles } from './theme';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';
import GlobalFloatingBadge from './GlobalFloatingBadge';

import { getMediaRemoteUrl } from '../../utils/media';
import { isCollection, isBlacklisted } from '../../utils/nfts';
import Blacklisted from '../../assets/images/Blacklisted.jpeg';
import IconSolana from '../../assets/images/IconSolana.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
    zIndex: 1,
  },
  touchable: {
    width: '100%',
    flexGrow: 1,
  },
  nameContainer: {
    backgroundColor: theme.colors.bgDarken,
    borderRadius: theme.borderRadius.borderRadiusXL,
    marginBottom: theme.gutters.paddingXXS,
    marginTop: -36,
    height: 70,
    zIndex: -1,
  },
  nftName: {
    paddingTop: theme.gutters.padding2XL + 6,
    paddingRight: 15,
    paddingLeft: 15,
  },
  badgeIcon: {
    marginLeft: theme.gutters.paddingXXS,
  },
  solanaIcon: {
    marginBottom: -3,
    marginLeft: 6,
    paddingHorizontal: theme.gutters.paddingXS,
  },
});

const GlobalNft = ({ nft, onClick = () => {}, t }) => (
  <>
    <TouchableOpacity onPress={() => onClick(nft)} style={styles.touchable}>
      <View key={nft.url} style={styles.image}>
        <GlobalFloatingBadge
          {...{
            titleTop: nft.marketInfo?.price && (
              <View style={globalStyles.inlineFlexButtons}>
                <GlobalText type="caption" color="body2" numberOfLines={1}>
                  {t('nft.listed_nft')}
                </GlobalText>
                <GlobalImage
                  circle
                  source={IconHyperspace}
                  size="xxs"
                  style={styles.badgeIcon}
                />
              </View>
            ),
          }}
        />
        <GlobalImage
          source={
            isBlacklisted(nft)
              ? Blacklisted
              : getMediaRemoteUrl(
                  isCollection(nft)
                    ? nft.thumb
                    : nft.media || nft.meta_data_img,
                )
          }
          size="block"
        />
        <GlobalFloatingBadge
          {...(isCollection(nft) && nft.length > 1
            ? { number: nft.length }
            : {
                title: (nft.lowest_listing_mpa?.price ||
                  nft.marketInfo?.price) && (
                  <>
                    <Text>
                      {nft.lowest_listing_mpa?.price?.toFixed(2) ||
                        nft.marketInfo?.price}
                    </Text>
                    <GlobalImage
                      source={IconSolana}
                      circle
                      size="xxs"
                      style={styles.badgeIcon}
                    />
                  </>
                ),
              })}
        />
      </View>
    </TouchableOpacity>
    <View style={styles.nameContainer}>
      <GlobalText
        style={styles.nftName}
        center
        type="caption"
        numberOfLines={1}>
        {isCollection(nft) ? nft.collection : nft.name || nft.symbol}
      </GlobalText>
    </View>
  </>
);
export default withTranslation()(GlobalNft);
