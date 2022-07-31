import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import { useNavigation, withParams } from '../../routes/hooks';
import { AppContext } from '../../AppProvider';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import GlobalText from '../../component-library/Global/GlobalText';
import { getWalletName } from '../../utils/wallet';
import { ROUTES_MAP } from './routes';
import GlobalButton from '../../component-library/Global/GlobalButton';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NftsDetailPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftDetail, setNftDetail] = useState({});
  const [{ activeWallet, walletNumber }] = useContext(AppContext);
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
            inlineTitle={getWalletName(activeWallet, walletNumber)}
            inlineAddress={activeWallet.getReceiveAddress()}
          />

          <View style={styles.centered}>
            <GlobalText type="headline2">{nftDetail.name}</GlobalText>
          </View>
          <GlobalButton
            type="primary"
            flex
            title={t('nfts.send.button')}
            onPress={goToSend}
            key={'send-button'}
            style={[styles.button, styles.buttonLeft]}
            touchableStyles={styles.buttonTouchable}
          />
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsDetailPage));
