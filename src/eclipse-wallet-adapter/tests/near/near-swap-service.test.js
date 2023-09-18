const { create } = require('../../factories/near-account-factory');
const { MNEMONIC, NETWORK } = require('./config');

const TOKEN_IN_ID = 'wrap.testnet';
const TOKEN_OUT_ID = 'ref.fakes.testnet';

test.skip('near-swap-quote', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });

  const amount = 0.00000000000001;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(TOKEN_IN_ID, TOKEN_OUT_ID, amount, slippage);
  expect(quote).toBeDefined();
});

test.skip('near-execute-swap', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const amount = 0.0000000000009;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(TOKEN_IN_ID, TOKEN_OUT_ID, amount, slippage);
  const result = await account.createSwapTransaction(quote, TOKEN_IN_ID, TOKEN_OUT_ID, amount);
  expect(result).toBeDefined();
});
