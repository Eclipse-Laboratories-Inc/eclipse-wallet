import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../AppProvider';
import GlobalCollapse from '../../../component-library/Global/GlobalCollapse';
import GlobalNftList from '../../../component-library/Global/GlobalNftList';
import { useNavigation } from '../../../routes/hooks';
import { withTranslation } from '../../../hooks/useTranslations';
import { isMoreThanOne } from '../../../utils/nfts';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../../../pages/Wallet/routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from '../../../pages/Nfts/routes';

const MyNfts = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [nftsList, setNftsList] = useState([]);
  const [listedInfo, setListedInfo] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const nfts = await activeBlockchainAccount.getAllNftsGrouped();
        setNftsList(nfts);
        const listed = await activeBlockchainAccount.getListedNfts();
        setListedInfo(listed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeBlockchainAccount]);

  const goToNFTs = token => {
    navigate(WALLET_ROUTES_MAP.WALLET_NFTS, { tokenId: token.address });
  };

  const onNftClick = nft => {
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
    <GlobalCollapse title={t('wallet.my_nfts')} viewAllAction={goToNFTs} isOpen>
      <GlobalNftList
        loading={loading}
        nonFungibleTokens={nftsList}
        listedInfo={listedInfo}
        onClick={onNftClick}
      />
    </GlobalCollapse>
  );
};

export default withTranslation()(MyNfts);
