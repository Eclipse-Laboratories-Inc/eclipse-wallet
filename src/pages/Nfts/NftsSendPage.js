import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import { useNavigation, withParams } from '../../routes/hooks';
import { AppContext } from '../../AppProvider';
import { cache, CACHE_TYPES } from '../../utils/cache';
import GlobalText from '../../component-library/Global/GlobalText';
import { getWalletName } from '../../utils/wallet';
import { ROUTES_MAP } from './routes';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NftsSendPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [finish, setFinish] = useState(false);
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
    navigate(ROUTES_MAP.NFTS_DETAIL, { id: params.id });
  };
  const onSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFinish(true);
    }, 2000);
  };
  return (
    (loaded && (
      <>
        {!sending && !finish && (
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
            </GlobalLayout.Header>
            <GlobalLayout.Footer>
              <GlobalButton
                type="primary"
                flex
                title={t('nfts.send.button')}
                onPress={onSend}
                key={'send-button'}
                style={[styles.button, styles.buttonLeft]}
                touchableStyles={styles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </GlobalLayout>
        )}
        {sending && (
          <GlobalLayout fullscreen>
            <GlobalLayout.Header>
              <GlobalPadding size="4xl" />
              <GlobalPadding size="4xl" />
              <View style={styles.centered}>
                <GlobalText type="headline2">
                  {t('nfts.send.processing')}
                </GlobalText>
              </View>
            </GlobalLayout.Header>
            <GlobalLayout.Footer>
              <GlobalButton
                type="primary"
                flex
                title={t('nfts.send.viewTransaction')}
                onPress={() => {}}
                key={'send-button'}
                style={[styles.button, styles.buttonLeft]}
                touchableStyles={styles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </GlobalLayout>
        )}
        {finish && (
          <GlobalLayout fullscreen>
            <GlobalLayout.Header>
              <GlobalPadding size="4xl" />
              <GlobalPadding size="4xl" />
              <View style={styles.centered}>
                <GlobalText type="headline2">
                  {t('nfts.send.finish')}
                </GlobalText>
              </View>
            </GlobalLayout.Header>
            <GlobalLayout.Footer>
              <GlobalButton
                type="primary"
                flex
                title={t('nfts.send.viewTransaction')}
                onPress={() => {}}
                key={'send-button'}
                style={[styles.button, styles.buttonLeft]}
                touchableStyles={styles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </GlobalLayout>
        )}
      </>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsSendPage));
