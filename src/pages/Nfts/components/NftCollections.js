import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import GlobalSlider from '../../../component-library/Global/GlobalSlider';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import NftCollectionItem from './NftCollectionItem';
import { withTranslation } from '../../../hooks/useTranslations';
import IconHyperspace from '../../../assets/images/IconHyperspace.jpeg';
import { AppContext } from '../../../AppProvider';

const styles = StyleSheet.create({
  collectionContainer: {
    backgroundColor: theme.colors.bgPrimary,
    borderRadius: theme.borderRadius.borderRadiusMD,
    padding: theme.gutters.paddingSM,
    paddingBottom: 15,
  },
});

const NftCollections = ({ t }) => {
  const [sliderItems, setSliderItems] = useState([]);
  const [{ activeWallet }] = useContext(AppContext);

  useEffect(() => {
    const getTrandingCollections = activeWallet.getCollectionGroup('trending');
    const getNewCollections = activeWallet.getCollectionGroup('new');
    if (activeWallet) {
      Promise.all([getTrandingCollections, getNewCollections]).then(
        ([trendColls, newColls]) => {
          setSliderItems([
            {
              title: t(`nft.trending_collections`),
              value: trendColls?.project_stats?.splice(0, 6),
            },
            {
              title: t(`nft.new_collections`),
              value: newColls?.project_stats?.splice(0, 6),
            },
          ]);
        },
      );
    }
  }, [activeWallet, t]);

  return (
    <>
      {sliderItems?.length ? (
        <GlobalSlider
          items={sliderItems.filter(({ value }) => value.length)}
          slides={sliderItems.length}
          renderItem={renderCollection}
          minHeight={294}
          maxHeight={740}
        />
      ) : null}
    </>
  );
};

const renderCollection = (item, expanded, t) => {
  const { title, value } = item;
  const maxItems = expanded ? 6 : 2;
  console.log(value);
  return (
    <View style={styles.collectionContainer}>
      <View style={globalStyles.inlineFlexButtons}>
        <GlobalText type="body2">{title}</GlobalText>
        <GlobalImage
          circle
          source={IconHyperspace}
          size="xs"
          style={globalStyles.centeredSmall}
        />
      </View>
      <GlobalPadding size="sm" />
      {value?.slice(0, maxItems).map(item => (
        <NftCollectionItem item={item} />
      ))}
    </View>
  );
};

export default withTranslation()(NftCollections);
