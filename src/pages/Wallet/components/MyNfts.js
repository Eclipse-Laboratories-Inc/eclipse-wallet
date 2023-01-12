import React, { useEffect, useState } from 'react';
import GlobalCollapse from '../../../component-library/Global/GlobalCollapse';
import GlobalNftList from '../../../component-library/Global/GlobalNftList';
import { useNavigation } from '../../../routes/hooks';
import { cache, CACHE_TYPES } from '../../../utils/cache';
import { isMoreThanOne, updatePendingNfts } from '../../../utils/nfts';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../../../pages/Wallet/routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from '../../../pages/Nfts/routes';

export const MyNfts = ({ activeWallet, whenLoading, translate }) => {
  const navigate = useNavigation();
  const [nftsList, setNftsList] = useState(null);
  const [listedInfo, setListedInfo] = useState([]);

  useEffect(() => {
    Promise.resolve(
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS,
        () => activeWallet.getAllNftsGrouped(),
      ),
    ).then(async nfts => {
      setNftsList(await updatePendingNfts(nfts));
      whenLoading(false);
      const listed = await activeWallet.getListedNfts();
      setListedInfo(listed);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWallet]);

  const goToNFTs = token =>
    navigate(WALLET_ROUTES_MAP.WALLET_NFTS, { tokenId: token.address });

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
    <>
      <GlobalCollapse
        title={translate('wallet.my_nfts')}
        viewAllAction={goToNFTs}
        isOpen>
        <GlobalNftList
          nonFungibleTokens={nftsList}
          listedInfo={listedInfo}
          onClick={onNftClick}
          t={translate}
        />
      </GlobalCollapse>
    </>
  );
};
