const { create } = require('../../factories/bitcoin-account-factory');
const { MNEMONIC, NETWORK } = require('./config');

test('bitcoin-account-get-balance', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const balance = await account.getBalance();
  console.log(JSON.stringify(balance, ' ', 4));
  expect(balance.usdTotal).toBeGreaterThanOrEqual(0);
  expect(balance.items.length).toBeGreaterThan(0);
});
