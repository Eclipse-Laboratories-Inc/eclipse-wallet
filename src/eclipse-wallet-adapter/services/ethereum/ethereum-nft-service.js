const http = require('axios');

const { SALMON_API_URL } = require('../../constants/environment');

const getAll = async (network, owner, noCache = false) => {
  const params = { owner, noCache };
  const { data } = await http.get(`${SALMON_API_URL}/v1/${network.id}/nft`, { params });
  return data;
};

const getAllGroupedByCollection = async (network, owner) => {
  const nfts = await getAll(network, owner);
  const nftsByCollection = getNftsByCollection(nfts);
  const nftsWithoutCollection = getNftsWithoutCollection(nfts);
  return [...nftsByCollection, ...nftsWithoutCollection];
};

const getCollections = (nfts) => {
  const collections = nfts.map((nft) => nft.collection?.name).filter((e) => e !== undefined);
  return Array.from(new Set(collections));
};

const getNftsByCollection = (nfts) => {
  const collections = getCollections(nfts);
  return collections
    .map((collection) => {
      const items = nfts.filter((nft) => nft.collection?.name === collection);
      const length = items.length;
      return {
        collection,
        length,
        items,
        thumb: items[0].media,
      };
    })
    .sort((a, b) => b.length - a.length);
};

const getNftsWithoutCollection = (nfts) => {
  return nfts.filter((nft) => !nft.collection);
};

const getNftByAddress = async (network, owner, contract, tokenId) => {
  const params = { owner };
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/${contract}/${tokenId}`;
  const { data } = await http.get(url, { params });
  return data;
};

module.exports = { getAll, getAllGroupedByCollection, getNftByAddress };
