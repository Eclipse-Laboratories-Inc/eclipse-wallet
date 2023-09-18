const getLast24HoursChange = (balances, usdTotal) => {
  const prevUsdTotal = getPreviousTotal(balances);
  const usd24HoursChange = usdTotal - prevUsdTotal;
  const perc24HoursChange = (usd24HoursChange * 100) / prevUsdTotal;
  return {
    usd: usd24HoursChange,
    perc: perc24HoursChange,
  };
};

const getPreviousTotal = (balances) => {
  return balances.reduce((currentValue, next) => getPreviousTokenBalance(next) + currentValue, 0);
};

const getPreviousTokenBalance = (balance) => {
  return balance.usdBalance * (1 - balance.last24HoursChange?.perc / 100) || 0;
};

module.exports = {
  getLast24HoursChange,
  getPreviousTotal,
  getPreviousTokenBalance,
};
