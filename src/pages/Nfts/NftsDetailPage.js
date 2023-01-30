import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import get from 'lodash/get';
import { BLOCKCHAINS, getSwitches } from '4m-wallet-adapter';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { getMediaRemoteUrl } from '../../utils/media';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalFloatingBadge from '../../component-library/Global/GlobalFloatingBadge';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import CardButton from '../../component-library/CardButton/CardButton';
import Header from '../../component-library/Layout/Header';
import IconSolana from '../../assets/images/IconSolana.png';
import IconHyperspaceWhite from '../../assets/images/IconHyperspaceWhite.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  renderItemStyle: {
    width: '49%',
    marginBottom: theme.gutters.paddingXS,
  },
  columnWrapperStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nftImage: {
    width: '80%',
    margin: 'auto',
  },
  imageContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hyperspaceIcon: {
    marginLeft: theme.gutters.paddingXXS,
  },
  topPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 55,
  },
  topPriceIcon: {
    marginLeft: theme.gutters.paddingXXS,
  },
});

const NftsDetailPage = ({ params, t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.NFT_DETAIL);
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [listedLoaded, setListedLoaded] = useState(false);
  const [nftDetail, setNftDetail] = useState({});
  const [listedInfo, setListedInfo] = useState([]);
  const [{ activeBlockchainAccount, networkId }] = useContext(AppContext);
  const [switches, setSwitches] = useState(null);

  useEffect(() => {
    getSwitches().then(allSwitches =>
      setSwitches(allSwitches[networkId].sections.nfts),
    );
  }, [networkId]);

  useEffect(() => {
    if (activeBlockchainAccount) {
      activeBlockchainAccount.getAllNfts().then(async nfts => {
        const nft = nfts.find(n => n.mint === params.id);
        if (nft) {
          setNftDetail(nft);
        }
        if (activeBlockchainAccount.network.blockchain === BLOCKCHAINS.SOLANA) {
          const listed = await activeBlockchainAccount.getListedNfts();
          setListedInfo(listed.find(l => l.token_address === params.id));
          setListedLoaded(true);
        }
        setLoaded(true);
      });
    }
  }, [activeBlockchainAccount, params.id]);

  const getListBtnTitle = () =>
    !listedLoaded ? (
      '...'
    ) : listedInfo ? (
      <>
        {t('nft.delist_nft')}
        {'  '}
        <GlobalImage
          source={IconHyperspaceWhite}
          size="xxs"
          style={{ marginBottom: -2 }}
        />
      </>
    ) : (
      <>
        {t('nft.list_nft')}
        {'  '}
        <GlobalImage
          source={IconHyperspaceWhite}
          size="xxs"
          style={{ marginBottom: -2 }}
        />
      </>
    );

  const hasProperties = () => {
    return get(nftDetail, 'extras.attributes', []).length > 0;
  };

  const goToBack = () => {
    navigate(ROUTES_MAP.NFTS_LIST);
  };

  const goToSend = () => {
    navigate(ROUTES_MAP.NFTS_SEND, { id: params.id });
  };

  const goToBurn = () => {
    navigate(ROUTES_MAP.NFTS_BURN, { id: params.id });
  };

  const goToListing = () => {
    navigate(ROUTES_MAP.NFTS_LISTING, {
      id: params.id,
      type: listedInfo ? 'unlist' : 'list',
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItemStyle}>
        <CardButton
          key={item.title}
          caption={item.caption}
          title={item.title}
          description={item.description}
          nospace
          readonly
        />
      </View>
    );
  };
  const title = nftDetail.name ? nftDetail.name : nftDetail.symbol;

  return (
    (loaded && (
      <GlobalLayout fullscreen>
        <GlobalLayout.Header>
          <Header />
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle={
              <GlobalText type="headline2" center>
                {title}
              </GlobalText>
            }
            nospace
          />

          <GlobalPadding size="xxs" />

          <View style={globalStyles.centered}>
            <GlobalPadding size="xs" />

            <View style={styles.imageContainer}>
              <GlobalImage
                source={getMediaRemoteUrl(nftDetail.media)}
                style={styles.nftImage}
                square
                squircle
              />
              {listedInfo?.market_place_state?.price && (
                <GlobalFloatingBadge
                  {...{
                    titleTopDetail: (
                      <View style={globalStyles.inlineFlexButtons}>
                        <GlobalText
                          type="caption"
                          color="body2"
                          numberOfLines={1}>
                          {t('nft.listed_nft')}
                        </GlobalText>
                        <GlobalImage
                          circle
                          source={IconHyperspace}
                          size="xxs"
                          style={styles.hyperspaceIcon}
                        />
                      </View>
                    ),
                    titleTopPrice: (
                      <View style={styles.topPrice}>
                        <GlobalText
                          type="caption"
                          color="tertiary"
                          numberOfLines={1}>
                          {listedInfo?.market_place_state?.price}
                        </GlobalText>
                        <GlobalImage
                          source={IconSolana}
                          circle
                          size="xxs"
                          style={styles.topPriceIcon}
                        />
                      </View>
                    ),
                  }}
                />
              )}
            </View>
          </View>

          <GlobalPadding size="lg" />

          <View style={globalStyles.inlineFlexButtons}>
            <GlobalSendReceive
              goToSend={goToSend}
              canSend={switches?.send}
              goToList={goToListing}
              canList={switches?.list_in_marketplace?.active}
              titleList={getListBtnTitle()}
              listedLoaded
              goToBurn={goToBurn}
              canBurn={switches?.burn}
            />
          </View>

          <GlobalPadding size="lg" />

          <GlobalText type="body2">{t('nft.description')}</GlobalText>

          <GlobalPadding size="sm" />

          <GlobalText type="body1" color="secondary">
            {nftDetail.description}
          </GlobalText>

          <GlobalPadding size="xl" />
          {hasProperties() && (
            <>
              <GlobalText type="body2">{t('nft.properties')}</GlobalText>

              <GlobalPadding size="sm" />

              <FlatList
                data={get(nftDetail, 'extras.attributes', []).map(a => ({
                  caption: a.trait_type,
                  title: a.value,
                  description: '',
                }))}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapperStyle}
              />
            </>
          )}
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsDetailPage));
