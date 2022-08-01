import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import { useNavigation } from '../../routes/hooks';
import { AppContext } from '../../AppProvider';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import GlobalText from '../../component-library/Global/GlobalText';
import { getWalletName } from '../../utils/wallet';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import { isCollection } from '../../utils/nfts';
import { ROUTES_MAP } from './routes';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NftsListPage = ({ t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftsGroup, setNftsGroup] = useState([]);
  const [{ activeWallet, walletNumber }] = useContext(AppContext);
  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS,
        () => activeWallet.getAllNftsGrouped(),
      ).then(nfts => {
        setNftsGroup(nfts);
        setLoaded(true);
      });
    }
  }, [activeWallet]);
  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };
  const onClick = nft => {
    if (isCollection(nft)) {
      navigate(ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else {
      navigate(ROUTES_MAP.NFTS_DETAIL, { id: nft.mint });
    }
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
            <GlobalText type="headline2">{t(`nfts.list.title`)}</GlobalText>
          </View>
          <GlobalNftList nonFungibleTokens={nftsGroup} onClick={onClick} />
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withTranslation()(NftsListPage);
