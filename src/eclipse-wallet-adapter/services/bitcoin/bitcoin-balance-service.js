'use strict';

const http = require('axios');
const { getLast24HoursChange } = require('../common-balance-service');
const { getPricesByPlatform } = require('../price-service');
const { BITCOIN } = require('../../constants/platforms');
const { decorateBalancePrices } = require('../token-decorator');
const { formatAmount } = require('../../services/format');
const { SALMON_API_URL } = require('../../constants/environment');

const getBitcoinBalance = async (network, publicKey) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/account/${publicKey}/balance`;

  const config = {
    params: { include: 'logo' },
  };

  const { data } = await http.get(url, config);

  return data.map((token) => ({
    ...token,
    uiAmount: formatAmount(token.amount, token.decimals),
  }));
};

const getPrices = async () => {
  try {
    return await getPricesByPlatform(BITCOIN);
  } catch (e) {
    console.log('Could not get prices', e.message);
    return null;
  }
};

const getBalance = async (network, publicKey) => {
  const bitcoinBalance = await getBitcoinBalance(network, publicKey);
  const prices = await getPrices();
  const balances = await decorateBalancePrices(bitcoinBalance, prices);
  if (prices) {
    const usdTotal = balances.reduce(
      (currentValue, next) => (next.usdBalance || 0) + currentValue,
      0
    );
    const last24HoursChange = getLast24HoursChange(balances, usdTotal);
    return { usdTotal, last24HoursChange, items: balances };
  } else {
    return { items: balances };
  }
};

const getCredit = async (network, publicKey) => {
  const bitcoinBalance = await getBitcoinBalance(network, publicKey);
  return bitcoinBalance[0].amount;
};

module.exports = {
  getBalance,
  getCredit,
};
