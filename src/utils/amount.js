import round from 'lodash/round';
import isNil from 'lodash/isNil';

export const showAmount = (amount, decimals = 2) =>
  !isNil(amount) ? `$${round(amount, decimals).toFixed(decimals)}` : '-';

export const showPercentage = perc =>
  `${perc > 0 ? '+' : ''}${round(perc * 100, 2).toFixed(2)}%`;
