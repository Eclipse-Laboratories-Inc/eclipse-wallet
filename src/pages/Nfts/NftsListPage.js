import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { getWalletName } from '../../utils/wallet';
import { isMoreThanOne } from '../../utils/nfts';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSlider from '../../component-library/Global/GlobalSlider';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconExpandLess from '../../assets/images/IconExpandLess.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';
import Header from '../../component-library/Layout/Header';
import AppIcon from '../../assets/images/AppIcon.png';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';
const { width: windowWidth } = Dimensions.get('window');

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
});

const NftsListPage = ({ t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.NFT_LIST);
  const navigate = useNavigation();
  const [{ activeWallet, config }] = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const [nftsGroup, setNftsGroup] = useState([]);
  const [listedInfo, setListedInfo] = useState([]);
  const [sliderHeight, setSliderHeight] = useState(294);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  // const [trendingCollections, setTrendingCollections] = useState([]);
  // const [newCollections, setNewCollections] = useState([]);
  // const [launchpadCollections, setLaunchpadCollections] = useState([]);
  const [sliderItems, setSliderItems] = useState([]);

  const sliderWidth = windowWidth - 28;

  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS,
        () => activeWallet.getAllNftsGrouped(),
      ).then(async nfts => {
        setNftsGroup(nfts);
        const listed = await activeWallet.getListedNfts();
        setListedInfo(listed);
        const trendColls = await activeWallet.getCollectionGroup('trending');
        setSliderItems([
          {
            title: 'Trending collections',
            value: trendColls?.project_stats?.splice(0, 6),
          },
        ]);
        setLoaded(true);
      });
    }
  }, [activeWallet]);
  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };
  const onClick = nft => {
    if (isMoreThanOne(nft)) {
      navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, {
        id: nft.mint || nft.items[0].mint,
      });
    }
  };

  const openCollection = async project_id => {
    const url = `https://hyperspace.xyz/collection//${project_id}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  const renderItem = ({ title, value }) => (
    <View
      style={{
        backgroundColor: theme.colors.bgPrimary,
        borderRadius: theme.borderRadius.borderRadiusMD,
        height: sliderHeight,
        width: sliderWidth,
        padding: theme.gutters.paddingSM,
      }}>
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
      {value?.slice(0, 2).map(coll => (
        <TouchableOpacity onPress={() => openCollection(coll.project_id)}>
          <View style={styles.itemContainer}>
            <GlobalImage
              source={coll.project.img_url}
              size="xxl"
              style={styles.image}
            />
            <View>
              <GlobalText type="body2">{coll.project.display_name}</GlobalText>
              <GlobalText type="caption">
                {coll.project.supply} Items
              </GlobalText>
              <GlobalText type="caption">Floor: {coll.floor_price}</GlobalText>
              <GlobalText type="caption">
                1D Volume: {coll.volume_1day} SOL
              </GlobalText>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      {isCollapseOpen &&
        value?.slice(2, 6).map(coll => (
          <TouchableOpacity onPress={() => openCollection(coll.project_id)}>
            <View style={styles.itemContainer}>
              <GlobalImage
                source={coll.project.img_url}
                size="xxl"
                style={styles.image}
              />
              <View>
                <GlobalText type="body2">
                  {coll.project.display_name}
                </GlobalText>
                <GlobalText type="caption">
                  {coll.project.supply} Items
                </GlobalText>
                <GlobalText type="caption">
                  Floor: {coll.floor_price}
                </GlobalText>
                <GlobalText type="caption">
                  1D Volume: {coll.volume_1day} SOL
                </GlobalText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      <GlobalButton
        type="icon"
        transparent
        icon={isCollapseOpen ? IconExpandLess : IconExpandMore}
        onPress={toggleCollapse}
        size="medium"
        style={styles.collapseButton}
      />
    </View>
  );

  const toggleCollapse = t => {
    setSliderHeight(isCollapseOpen ? 294 : 740);
    setIsCollapseOpen(!isCollapseOpen);
  };

  // const items = [
  //   {
  //     title: 'Trending collections',
  //     value: trendingCollections,
  //   },
  //   {
  //     title: 'New collections',
  //     value: newCollections,
  //   },
  //   {
  //     title: 'Launchpad',
  //     value: launchpadCollections,
  //   },
  // ];
  return (
    (
      <GlobalLayout>
        {loaded && (
          <GlobalLayout.Header>
            <Header activeWallet={activeWallet} config={config} t={t} />
            <View style={globalStyles.centered}>
              <GlobalText type="headline2">{t(`wallet.nfts`)}</GlobalText>
            </View>
            {sliderItems?.length && (
              <GlobalSlider
                items={sliderItems.filter(({ value }) => value.length)}
                // slides={items.filter(({ value }) => value).length}
                slides={sliderItems.length}
                renderItem={renderItem}
                sliderHeight={sliderHeight}
              />
            )}
            <View style={globalStyles.centered}>
              <GlobalText type="headline2">{t(`wallet.my_nfts`)}</GlobalText>
            </View>
            <GlobalNftList
              nonFungibleTokens={nftsGroup}
              listedInfo={listedInfo}
              onClick={onClick}
            />
          </GlobalLayout.Header>
        )}
        {!loaded && <GlobalSkeleton type="NftListScreen" />}
      </GlobalLayout>
    ) || null
  );
};

export default withTranslation()(NftsListPage);
