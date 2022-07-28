import round from 'lodash/round';
import isNil from 'lodash/isNil';

export const showAmount = (amount, decimals = 2) =>
  !isNil(amount) ? `$${round(amount, decimals).toFixed(decimals)}` : '-';
export const showValue = (amount, decimals = 2) =>
  !isNil(amount) ? `${round(amount, decimals).toFixed(decimals)}` : '-';

export const isPositive = perc => perc > 0;
export const isNegative = perc => perc < 0;
export const isNeutral = perc => !perc;

export const getLabelValue = perc => {
  if (isPositive(perc)) {
    return 'positive';
  } else if (isNegative(perc)) {
    return 'negative';
  }
  return 'neutral';
};

export const showPercentage = perc => {
  const val = round(isNaN(perc) ? 0 : perc, 2).toFixed(2);
  if (isPositive(perc)) {
    return `+${val} %`;
  } else if (isNegative(perc)) {
    return `${val} %`;
  }
  return `${val} %`;
};

export const hiddenValue = '·······';
