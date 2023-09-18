const {
  utils: {
    web: { fetchJson },
  },
} = require('near-api-js');

const listTokensPrices = async (network) => {
  const { apiUrl } = network.config.refFinance;

  const prices = await fetchJson(`${apiUrl}/list-token-price`);

  return Object.entries(prices).map(([id, { price, symbol, decimal }]) => ({
    id,
    usdPrice: Number(price),
    symbol,
    decimal,
  }));
};

const listTokens = async (network) => {
  const { apiUrl } = network.config.refFinance;

  const tokens = await fetchJson(`${apiUrl}/list-token`);

  return Object.entries(tokens).map(
    ([id, { spec, name, symbol, icon, reference, reference_hash, decimals }]) => ({
      id,
      spec,
      name,
      symbol,
      icon,
      reference,
      reference_hash,
      decimals,
    })
  );
};

module.exports = {
  listTokensPrices,
  listTokens,
};
