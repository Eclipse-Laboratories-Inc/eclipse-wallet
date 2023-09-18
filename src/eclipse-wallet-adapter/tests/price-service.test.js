const { getPricesByPlatform } = require('../services/price-service');
const { NEAR, SOLANA, ETHEREUM, BITCOIN } = require('../constants/platforms');

test.skip('price-get-solana-prices', async () => {
  const prices = await getPricesByPlatform(SOLANA);
  expect(prices.length).toBeGreaterThan(0);
});

test.skip('price-get-near-prices', async () => {
  const prices = await getPricesByPlatform(NEAR);
  expect(prices.length).toBeGreaterThan(0);
});

test.skip('price-get-ethereum-prices', async () => {
  const prices = await getPricesByPlatform(ETHEREUM);
  expect(prices.length).toBeGreaterThan(0);
});

test.skip('price-get-bitcoin-prices', async () => {
  const prices = await getPricesByPlatform(BITCOIN);
  expect(prices.length).toBeGreaterThan(0);
});
