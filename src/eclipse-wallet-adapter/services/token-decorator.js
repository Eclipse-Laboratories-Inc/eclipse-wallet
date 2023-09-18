const decorateBalanceList = async (items, tokens) => {
  const result = items.map((item) => {
    const token = tokens.find((t) => t.address == item.mint);
    return { ...item, ...token };
  });
  const validTokens = result.filter((t) => t.name);
  return validTokens;
};

const decorateBalancePrices = async (items, prices) => {
  const result = items.map((item) => {
    const price = item.symbol
      ? prices?.find((t) => t.id == item.coingeckoId) ||
        prices?.find((t) => t.symbol.toUpperCase() == item.symbol.toUpperCase())
      : null;
    const usdBalance = price?.usdPrice ? item.uiAmount * price.usdPrice : null;
    const last24HoursChange = getLast24HoursChange(price, usdBalance);
    return {
      ...item,
      usdPrice: price ? price.usdPrice : null,
      usdBalance,
      last24HoursChange,
    };
  });
  return result;
};

const getLast24HoursChange = (price, usdBalance) => {
  if (price?.perc24HoursChange === undefined || price?.perc24HoursChange === null) {
    return null;
  }

  const perc = price.perc24HoursChange;
  const prevBalance = (1 - perc / 100) * usdBalance;
  const usd = usdBalance - prevBalance;
  return {
    perc,
    usd,
  };
};

module.exports = {
  decorateBalanceList,
  decorateBalancePrices,
};
