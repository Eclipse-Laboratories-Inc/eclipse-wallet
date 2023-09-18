const { create } = require('../../factories/near-account-factory');
const { MNEMONIC, NETWORK } = require('./config');

test('near-wrap-near', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const result1 = await account.wrapNear(1);
  expect(result1).toBeDefined();
  const result2 = await account.unwrapNear(1);
  expect(result2).toBeDefined();
});
