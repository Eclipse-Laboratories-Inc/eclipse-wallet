export const isCollection = nft => nft.items;
export const isMoreThanOne = nft => nft.items?.length > 1;
export const isBlacklisted = nft =>
  isCollection(nft) ? nft.items[0].blacklisted : nft.blacklisted;
