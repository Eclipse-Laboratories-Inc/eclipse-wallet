import storage from './storage';
import STORAGE_KEYS from './storageKeys';

export const isCollection = nft => nft.items;
export const isMoreThanOne = nft => nft.items?.length > 1;
export const isBlacklisted = nft =>
  isCollection(nft) ? nft.items[0].blacklisted : nft.blacklisted;
export const getNftListedInfo = (nft, listedInfo) => {
  if (!isCollection(nft)) {
    listedInfo.forEach(info => {
      if (info.token_address === nft.mint) {
        nft.marketInfo = info.market_place_state;
        return nft;
      }
    });
  }
  return nft;
};
export const updatePendingNfts = async nfts => {
  const dateNow = new Date().getTime();
  const allPendingBuy = await storage.getItem(STORAGE_KEYS.PENDING_NFTS_BUY);
  const pendingNftsBuy = allPendingBuy?.filter(
    pNft =>
      !nfts.find(nft => pNft.token_address === nft.mint) &&
      pNft.pendingExpires > dateNow,
  );
  const allPendingSend = await storage.getItem(STORAGE_KEYS.PENDING_NFTS_SEND);
  nfts.forEach(nft => {
    if (allPendingSend?.find(pNft => pNft.mint === nft.mint))
      nft.pending = true;
  });
  return nfts.concat(pendingNftsBuy || []);
};
