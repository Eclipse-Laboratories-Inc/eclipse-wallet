const {
  utils: {
    format: { formatNearAmount },
  },
} = require('near-api-js');
const { decorateBalancePrices } = require('../token-decorator');
const { getOwnTokens } = require('./near-token-service');
const { NEAR_NAME } = require('../../constants/token-constants');
const { getLast24HoursChange } = require('../common-balance-service');
const { getPricesByIds } = require('../price-service');
const { listTokensPrices } = require('./ref-finance-service');

const getNearBalance = async (connection, network) => {
  const { accountId } = connection;

  let amount;
  try {
    const balance = await connection.getAccountBalance();
    amount = balance.total;
  } catch (e) {
    if (!e.message?.includes('does not exist while viewing')) {
      throw e;
    }
    amount = 0;
  }

  const { currency, icon } = network;

  return {
    owner: accountId,
    amount,
    uiAmount: formatNearAmount(amount),
    name: NEAR_NAME,
    logo: icon,
    address: 'near',
    type: 'native',
    ...currency,
  };
};

const getBalance = async (connection, network) => {
  const nearBalance = await getNearBalance(connection, network);
  const tokensBalance = await getOwnTokens(connection, network);
  const contractsIds = tokensBalance.map(({ address }) => address);
  const prices = await getPrices(network, contractsIds);
  const balances = await decorateBalancePrices([nearBalance, ...tokensBalance], prices);
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

const getPrices = async (network, contractsIds) => {
  try {
    const prices = await getPricesByIds(['near', 'usn']);

    const tokensPrices = await listTokensPrices(network);

    return prices.concat(tokensPrices.filter(({ id }) => contractsIds.includes(id)));
  } catch (e) {
    console.log('Could not get prices', e.message);
    return null;
  }
};

module.exports = { getBalance };
