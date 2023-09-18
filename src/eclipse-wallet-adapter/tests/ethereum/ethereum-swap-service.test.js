const { create } = require('../../factories/ethereum-account-factory');
const { MNEMONIC, NETWORK } = require('./config');

const TOKEN_IN_ID = 'eth';
const TOKEN_OUT_ID = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

test.skip('ethereum-swap-quote', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });

  const amount = 0.00000000000001;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(TOKEN_IN_ID, TOKEN_OUT_ID, amount, slippage);
  expect(quote).toBeDefined();
});

test.skip('ethereum-execute-swap', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const amount = 0.0000000000009;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(TOKEN_IN_ID, TOKEN_OUT_ID, amount, slippage);
  const result = await account.createSwapTransaction(quote, TOKEN_IN_ID, TOKEN_OUT_ID, amount);
  expect(result).toBeDefined();
});
