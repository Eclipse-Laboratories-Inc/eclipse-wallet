'use strict';

const { decorateBalanceList, decorateBalancePrices } = require('../token-decorator');
const { getTokensByOwner, getTokenList } = require('./ethereum-token-list-service');
const { getLast24HoursChange } = require('../common-balance-service');
const { getPricesByPlatform } = require('../price-service');
const { ETHEREUM } = require('../../constants/platforms');

const getTokensBalance = async (network, address, tokenAddresses) => {
  const ownerTokens = await getTokensByOwner(network, address, tokenAddresses);
  const tokens = await getTokenList(network);
  return decorateBalanceList(ownerTokens, tokens);
};

const getPrices = async () => {
  try {
    return await getPricesByPlatform(ETHEREUM);
  } catch (e) {
    console.log('Could not get prices', e.message);
    return null;
  }
};

const getBalance = async (network, address, tokenAddresses) => {
  const tokensBalance = await getTokensBalance(network, address, tokenAddresses);
  const prices = await getPrices();
  const balances = await decorateBalancePrices(tokensBalance, prices);
  if (prices) {
    const sortedBalances = balances.sort((a, b) => a.usdBalance < b.usdBalance);
    const usdTotal = balances.reduce(
      (currentValue, next) => (next.usdBalance || 0) + currentValue,
      0
    );
    const last24HoursChange = getLast24HoursChange(balances, usdTotal);
    return { usdTotal, last24HoursChange, items: sortedBalances };
  } else {
    return { items: balances };
  }
};

module.exports = { getBalance };
