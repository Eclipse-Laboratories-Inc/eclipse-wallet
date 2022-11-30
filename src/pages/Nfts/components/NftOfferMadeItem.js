import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import { useNavigation } from '../../../routes/hooks';
import { ROUTES_MAP } from '../routes';
import { withTranslation } from '../../../hooks/useTranslations';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import NftsBiddingPageModal from '../NftsBiddingPageModal';

const styles = StyleSheet.create({
  image: {
    marginRight: theme.gutters.paddingSM,
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
    zIndex: 1,
  },
  itemContainer: {
    marginBottom: theme.gutters.paddingSM,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseButton: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: -20,
    backgroundColor: theme.colors.bgPrimary,
  },
  updateBtn: {
    minHeight: 0,
    alignSelf: 'left',
    justifyContent: 'left',
    paddingHorizontal: 0,
  },
  updateBtnTxt: {
    fontFamily: theme.fonts.dmSansRegular,
    fontSize: theme.fontSize.fontSizeSM,
    lineHeight: theme.lineHeight.lineHeightSM,
    letterSpacing: 0.004,
    color: theme.colors.accentTertiary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
  cancelBtnTxt: {
    fontFamily: theme.fonts.dmSansRegular,
    fontSize: theme.fontSize.fontSizeSM,
    lineHeight: theme.lineHeight.lineHeightSM,
    letterSpacing: 0.004,
    color: theme.colors.accentPrimary,
    fontWeight: 'normal',
    textTransform: 'uppercase',
  },
});

const NftOfferMadeItem = ({ item, isModalOpen, setIsModalOpen, t }) => {
  const navigate = useNavigation();

  const openCollection = async project_id => {
    navigate(ROUTES_MAP.NFTS_COLLECTION_DETAIL, {
      id: project_id,
    });
  };

  const openOffer = async () => {
    const url = 'https://hyperspace.xyz/account/';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  const cancelOffer = () => {
    setIsModalOpen(true);
  };
  return (
    <TouchableOpacity onPress={() => openCollection(item.project_id)}>
      <View style={styles.itemContainer}>
        <GlobalImage
          source={item.meta_data_img}
          url={item.meta_data_img}
          size="xxl"
          style={styles.image}
        />
        <View>
          <GlobalText type="body2">{item.name}</GlobalText>
          <GlobalText type="caption">{item.project_name}</GlobalText>
          <GlobalText type="caption">
            Price: {item.floor_price?.toFixed(2)}
          </GlobalText>
          <GlobalText type="caption">
            Offer made: {item.market_place_state.price} SOL
          </GlobalText>
          <View style={globalStyles.inline}>
            <GlobalButton
              type="text"
              style={styles.updateBtn}
              textStyle={styles.updateBtnTxt}
              title={t('nft.update')}
              onPress={openOffer}
            />
            <GlobalButton
              type="text"
              style={{ minHeight: 0 }}
              textStyle={styles.cancelBtnTxt}
              title={t('actions.cancel')}
              onPress={cancelOffer}
            />
          </View>
        </View>
      </View>
      <Modal
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
        visible={isModalOpen}>
        <NftsBiddingPageModal
          id={item.project_id}
          nftId={item.token_address}
          pageNumber={1}
          type="cancel-offer"
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </TouchableOpacity>
  );
};

export default withTranslation()(NftOfferMadeItem);
