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
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import { ROUTES_MAP } from './routes';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NftsCollectionPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftsCollection, setNftsCollection] = useState([]);
  const [{ activeWallet, config }] = useContext(AppContext);
  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS,
        () => activeWallet.getAllNftsGrouped(),
      ).then(nfts => {
        const collection = nfts.find(n => n.collection === params.id);
        if (collection) {
          setNftsCollection(collection.items);
        }
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);
  const goToBack = () => {
    navigate(ROUTES_MAP.NFTS_LIST);
  };
  const onClick = nft => {
    navigate(ROUTES_MAP.NFTS_DETAIL, { id: nft.mint });
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

          <View style={styles.centered}>
            <GlobalText type="headline2">{params.id}</GlobalText>
          </View>
          <GlobalNftList nonFungibleTokens={nftsCollection} onClick={onClick} />
        </GlobalLayout.Header>
      </GlobalLayout>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsCollectionPage));
