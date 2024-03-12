const decorateBalanceList = async (items, tokens) => {
  const result = items.map((item) => {
    const token = tokens.find((t) => t.address == item.mint);
    return { ...item, ...token };
  });
  const validTokens = result.filter((t) => t.name);
  return validTokens;
};

const decorateBalancePrices = async (items, prices) => {
  const prices_a = [prices].flat(); 
  const result = items.map((item) => {
    const price = item.symbol
      ? prices_a?.find((t) => t.id == item.coingeckoId) ||
      prices_a?.find((t) => t.symbol.toUpperCase() == item.symbol.toUpperCase())
      : null;
    
    const usd_price = price?.market_data?.current_price?.usd
    const usdBalance = usd_price ? item.uiAmount * usd_price : null;
    const last24HoursChange = getLast24HoursChange(price, usdBalance);
    return {
      ...item,
      usdPrice: price ? usd_price : null,
      usdBalance,
      last24HoursChange,
    };
  });
  return result;
};

const getLast24HoursChange = (price, usdBalance) => {
  if (price?.price_change_24h === undefined || price?.price_change_24h === null) {
    return null;
  }

  const perc = price.price_change_24h;
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
