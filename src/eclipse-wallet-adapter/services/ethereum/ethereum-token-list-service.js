'use strict';

const http = require('axios');
const { formatAmount } = require('../format');
const { SALMON_API_URL } = require('../../constants/environment');

let tokenLists = {};

async function getTokenList(network) {
  if (tokenLists[network.id]) {
    return tokenLists[network.id];
  }

  const { data: tokenList } = await http.get(`${SALMON_API_URL}/v1/${network.id}/ft`);

  tokenLists[network.id] = tokenList;

  return tokenList;
}

async function getTokensByOwner(network, address, tokenAddresses) {
  const url = `${SALMON_API_URL}/v1/${network.id}/account/${address}/balance`;

  const config = {
    params: {
      include: 'logo',
      tokens: tokenAddresses?.join(','),
    },
  };

  const { data } = await http.get(url, config);

  return data.map((token) => ({ ...token, uiAmount: formatAmount(token.amount, token.decimals) }));
}

async function getTokenBySymbol(network, symbol) {
  const tokens = await getTokenList(network);
  return tokens.filter((t) => t.symbol == symbol);
}

async function getTokenByAddress(network, address) {
  const tokens = await getTokenList(network);
  return tokens.filter((t) => t.address == address);
}

async function getFeaturedTokenList(network) {
  const tokens = await getTokenList(network);
  const featuredList = [
    { symbol: 'WETH', name: 'Wrapped Ether' },
    { symbol: 'DAI', name: 'Dai Stablecoin' },
    { symbol: 'SHIB', name: 'Shiba Inu' },
    { symbol: 'SAND', name: 'The Sandbox' },
    { symbol: 'USDT', name: 'Tether USD' },
    { symbol: 'USDC', name: 'USDCoin' },
    { symbol: 'UNI', name: 'Uniswap' },
  ];
  return tokens.filter((t) => featuredList.some((el) => el.symbol === t.symbol));
}

module.exports = {
  getTokenList,
  getTokensByOwner,
  getTokenBySymbol,
  getTokenByAddress,
  getFeaturedTokenList,
};
