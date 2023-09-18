const {
  utils: {
    web: { fetchJson },
  },
} = require('near-api-js');

const listAccountsByPublicKey = async (network, publicKey) => {
  const { indexerUrl } = network.config;

  return fetchJson(`${indexerUrl}/publicKey/${publicKey}/accounts`);
};

const listLikelyNfts = async (network, accountId) => {
  const { indexerUrl } = network.config;

  return fetchJson(`${indexerUrl}/account/${accountId}/likelyNFTs`);
};

const listLikelyTokens = async (network, accountId) => {
  const { indexerUrl } = network.config;

  return fetchJson(`${indexerUrl}/account/${accountId}/likelyTokens`);
};

const listRecentTransactions = async (network, accountId) => {
  const { indexerUrl } = network.config;

  return fetchJson(`${indexerUrl}/account/${accountId}/activity`);
};

module.exports = {
  listAccountsByPublicKey,
  listLikelyNfts,
  listLikelyTokens,
  listRecentTransactions,
};
