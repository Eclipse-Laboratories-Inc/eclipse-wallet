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
