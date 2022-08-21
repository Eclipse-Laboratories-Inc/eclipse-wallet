import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as NTFS_ROUTES_MAP } from './routes';
import { getWalletName } from '../../utils/wallet';
import { isCollection } from '../../utils/nfts';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import GlobalText from '../../component-library/Global/GlobalText';

const NftsListPage = ({ t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftsGroup, setNftsGroup] = useState([]);

  const [{ activeWallet, config }] = useContext(AppContext);
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
      navigate(NTFS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else {
      navigate(NTFS_ROUTES_MAP.NFTS_DETAIL, { id: nft.mint });
    }
  };

  return (
    (
      <GlobalLayout fullscreen>
<<<<<<< HEAD
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle={getWalletName(
              activeWallet.getReceiveAddress(),
              config,
            )}
            inlineAddress={activeWallet.getReceiveAddress()}
          />
=======
        {loaded && (
          <GlobalLayout.Header>
            <GlobalBackTitle
              inlineTitle={getWalletName(
                activeWallet.getReceiveAddress(),
                config,
              )}
              inlineAddress={activeWallet.getReceiveAddress()}
            />
>>>>>>> develop

            <View style={globalStyles.centered}>
              <GlobalText type="headline2">{t(`wallet.my_nfts`)}</GlobalText>
            </View>

            <GlobalNftList nonFungibleTokens={nftsGroup} onClick={onClick} />
          </GlobalLayout.Header>
        )}
        {!loaded && <GlobalSkeleton type="NftListScreen" />}
      </GlobalLayout>
    ) || null
  );
};

export default withTranslation()(NftsListPage);
