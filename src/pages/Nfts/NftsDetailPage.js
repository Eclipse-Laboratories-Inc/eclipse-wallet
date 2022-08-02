import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Grid from '@mui/material/Grid';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { getWalletName } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
import { isCollection } from '../../utils/nfts';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import CardButton from '../../component-library/CardButton/CardButton';

const NftsDetailPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftDetail, setNftDetail] = useState({});
  const [{ activeWallet, config }] = useContext(AppContext);
  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS_ALL,
        () => activeWallet.getAllNfts(),
      ).then(nfts => {
        const nft = nfts.find(n => n.mint === params.id);
        if (nft) {
          setNftDetail(nft);
        }
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);
  const goToBack = () => {
    navigate(ROUTES_MAP.NFTS_LIST);
  };
  const goToSend = () => {
    navigate(ROUTES_MAP.NFTS_SEND, { id: params.id });
  };
  return (
    (loaded && (
      <GlobalLayout fullscreen>
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle={getWalletName(
              activeWallet.getReceiveAddress(),
              config,
            )}
            inlineAddress={activeWallet.getReceiveAddress()}
          />

          <View style={globalStyles.centered}>
            <GlobalText type="headline2" center>
              {nftDetail.name}
            </GlobalText>

            <View style={globalStyles.squareRatio}>
              <GlobalImage
                source={getMediaRemoteUrl(
                  isCollection(nftDetail) ? nftDetail.thumb : nftDetail.media,
                )}
                style={globalStyles.bigImage}
                square
                squircle
              />
            </View>

            <GlobalPadding size="xl" />

            <GlobalButton
              type="primary"
              wideSmall
              title={t('nft.send_nft')}
              onPress={goToSend}
            />

            <GlobalPadding size="3xl" />

            <View style={globalStyles.inlineFlexAround}>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
              <GlobalText type="overline" color="tertiary">
                Lorem ipsum
              </GlobalText>
            </View>
          </View>

          <GlobalPadding size="3xl" />

          <GlobalText type="body2">{t('nft.description')}</GlobalText>

          <GlobalPadding size="sm" />

          <GlobalText type="body1" color="secondary">
            Dour Darcels are a collection of 10,000 moody frens from the world
            of Darcel Disappoints. Randomly generated and carefully curated,
            every Darcel is individual and unique – just like frens IRL. Each
            Darcel is a NFT that lives on the Ethereum blockchain and is the key
            to the Dour Darcels community.
          </GlobalText>

          <GlobalPadding size="xl" />

          <GlobalText type="body2">{t('nft.properties')}</GlobalText>

          <GlobalPadding size="sm" />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <CardButton
                caption="Background"
                title="Light Blue"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <CardButton
                caption="Body"
                title="Regular"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <CardButton
                caption="Clothing"
                title="Animal Print"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <CardButton
                caption="Eyes"
                title="One"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <CardButton
                caption="Head"
                title="Glasses Wood"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <CardButton
                caption="Mouth"
                title="Excited"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <CardButton
                caption="Legs"
                title="Woodgrain Sweep"
                description="5% have this trait"
                nospace
                readonly
              />
            </Grid>
          </Grid>
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsDetailPage));
