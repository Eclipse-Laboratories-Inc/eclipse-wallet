import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getSwitches } from 'eclipse-wallet-adapter';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { isMoreThanOne, updatePendingNfts } from '../../utils/nfts';

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
  const [{ activeBlockchainAccount, networkId }] = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const [listedInfo, setListedInfo] = useState([]);
  const [nftsGroup, setNftsGroup] = useState([]);
  const [switches, setSwitches] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getSwitches().then(allSwitches =>
      setSwitches(allSwitches[networkId].sections.nfts),
    );
  }, [networkId]);

  useEffect(() => {
    const load = async () => {
      if (activeBlockchainAccount) {
        try {
          setLoaded(false);
          const nfts = await activeBlockchainAccount.getAllNftsGrouped();
          setNftsGroup(await updatePendingNfts(nfts));
          if (switches?.list_in_marketplace?.active) {
            const listed = await activeBlockchainAccount.getListedNfts();
            setListedInfo(listed);
          }
        } finally {
          setLoaded(true);
        }
      }
    };

    load();
  }, [activeBlockchainAccount, switches]);

  const onClick = nft => {
    if (!nft.pending) {
      if (isMoreThanOne(nft)) {
        navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
      } else {
        navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, {
          id: nft.mint || nft.items[0].mint,
        });
      }
    }
  };

  return (
    (
      <GlobalLayout style={isModalOpen && styles.container}>
        {loaded && (
          <GlobalLayout.Header>
            <Header />
            <View>
              <GlobalText center type="headline2">
                {t(`wallet.nfts`)}
              </GlobalText>
            </View>
            {switches?.list_in_marketplace?.active && <NftCollections t />}
            <View>
              <GlobalText type="headline3">{t(`wallet.my_nfts`)}</GlobalText>
            </View>
            <GlobalNftList
              nonFungibleTokens={nftsGroup}
              listedInfo={listedInfo}
              onClick={onClick}
            />
            {switches?.list_in_marketplace?.active && (
              <NftOffersMade
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                t
              />
            )}
          </GlobalLayout.Header>
        )}
        {!loaded && <GlobalSkeleton type="NftListScreen" />}
      </GlobalLayout>
    ) || null
  );
};

export default withTranslation()(NftsListPage);
