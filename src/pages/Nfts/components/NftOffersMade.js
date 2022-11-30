import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import GlobalSlider from '../../../component-library/Global/GlobalSlider';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalSkeleton from '../../../component-library/Global/GlobalSkeleton';
import NftOfferMadeItem from './NftOfferMadeItem';
import { withTranslation } from '../../../hooks/useTranslations';
import IconHyperspace from '../../../assets/images/IconHyperspace.jpeg';
import { AppContext } from '../../../AppProvider';

const styles = StyleSheet.create({
  collectionContainer: {
    backgroundColor: theme.colors.bgPrimary,
    borderRadius: theme.borderRadius.borderRadiusMD,
    padding: theme.gutters.paddingSM,
    paddingBottom: theme.gutters.paddingNormal,
  },
});

const NftOffersMade = ({ t }) => {
  const [sliderItems, setSliderItems] = useState([]);
  const [{ activeWallet }] = useContext(AppContext);
  const [bidsLoaded, setBidsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeWallet) {
      Promise.resolve(activeWallet.getNftsBids()).then(bids => {
        setSliderItems([
          {
            value: bids,
          },
        ]);
        setBidsLoaded(true);
      });
    }
  }, [activeWallet, isModalOpen]);

  const renderCollection = ({ item }) => {
    const { value } = item;
    const maxItems = isExpanded ? item.length : 2;
    return (
      <View style={styles.collectionContainer}>
        <GlobalPadding size="xxs" />
        {value?.slice(0, maxItems).map(item => (
          <NftOfferMadeItem
            item={item}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      {sliderItems[0]?.value?.length ? (
        <>
          <View>
            <GlobalPadding size="xl" />
            <GlobalText type="headline3">{t(`nft.offers_made`)}</GlobalText>
          </View>
          <GlobalSlider
            items={sliderItems.filter(({ value }) => value.length)}
            slides={sliderItems.length}
            renderItem={renderCollection}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            minHeight={sliderItems[0]?.value?.length === 1 ? 130 : 256}
            maxHeight={120 * sliderItems[0]?.value?.length}
          />
        </>
      ) : null}
      {!bidsLoaded && (
        <>
          <GlobalPadding size="xl" />
          <GlobalSkeleton type="NftSlider" />
        </>
      )}
    </>
  );
};

export default withTranslation()(NftOffersMade);
