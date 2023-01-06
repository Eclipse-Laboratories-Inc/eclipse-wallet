import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { isMoreThanOne } from '../../utils/nfts';

import theme from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';
import NftCollections from './components/NftCollections';
import NftOffersMade from './components/NftOffersMade';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black300,
  },
});

const NftsListPage = ({ t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.NFT_LIST);
  const navigate = useNavigation();
  const [{ activeWallet, config }] = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const [listedInfo, setListedInfo] = useState([]);
  const [nftsGroup, setNftsGroup] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setLoaded(true);
      });
    }
  }, [activeWallet]);

  const onClick = nft => {
    if (isMoreThanOne(nft)) {
      navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, {
        id: nft.mint || nft.items[0].mint,
      });
    }
  };

  return (
    (
      <GlobalLayout style={isModalOpen && styles.container}>
        {loaded && (
          <GlobalLayout.Header>
            <Header activeWallet={activeWallet} config={config} t={t} />
            <View>
              <GlobalText center type="headline2">
                {t(`wallet.nfts`)}
              </GlobalText>
            </View>
            <NftCollections t />
            <View>
              <GlobalText type="headline3">{t(`wallet.my_nfts`)}</GlobalText>
            </View>
            <GlobalNftList
              nonFungibleTokens={nftsGroup}
              listedInfo={listedInfo}
              onClick={onClick}
            />
            <NftOffersMade
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              t
            />
          </GlobalLayout.Header>
        )}
        {!loaded && <GlobalSkeleton type="NftListScreen" />}
      </GlobalLayout>
    ) || null
  );
};

export default withTranslation()(NftsListPage);
