const { create } = require('../../factories/near-account-factory');
const { MNEMONIC, IMPLICIT_MNEMONIC, TOKEN_NAME, NETWORK } = require('./config');

test('near-transfer-near', async () => {
  const account1 = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const account2 = await create({ network: NETWORK, mnemonic: IMPLICIT_MNEMONIC });
  const amount = 1;
  const result1 = await account1.createTransferTransaction(
    account2.getReceiveAddress(),
    null,
    amount
  );
  expect(result1).toBeDefined();
  const result2 = await account2.createTransferTransaction(
    account1.getReceiveAddress(),
    null,
    amount
  );
  expect(result2).toBeDefined();
});

test('near-transfer-token', async () => {
  const account1 = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const account2 = await create({ network: NETWORK, mnemonic: IMPLICIT_MNEMONIC });
  const amount = 1;
  const opts = { memo: 'This is a test!' };
  const result1 = await account1.createTransferTransaction(
    account2.getReceiveAddress(),
    TOKEN_NAME,
    amount,
    opts
  );
  expect(result1).toBeDefined();
  // Back amount to mantain balance
  const result2 = await account2.createTransferTransaction(
    account1.getReceiveAddress(),
    TOKEN_NAME,
    amount,
    opts
  );
  expect(result2).toBeDefined();
});
