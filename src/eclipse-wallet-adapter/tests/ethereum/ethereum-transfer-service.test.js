const { create } = require('../../factories/ethereum-account-factory');
const { MNEMONIC, OTHER_MNEMONIC, TOKEN_NAME, NETWORK } = require('./config');
const { ETH_ADDRESS } = require('../../constants/token-constants');

test.skip('ethereum-transfer-eth', async () => {
  const account1 = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const account2 = await create({ network: NETWORK, mnemonic: OTHER_MNEMONIC });
  const amount = 1;
  const result1 = await account1.createTransferTransaction(
    account2.getReceiveAddress(),
    ETH_ADDRESS,
    amount
  );
  expect(result1).toBeDefined();
  const result2 = await account2.createTransferTransaction(
    account1.getReceiveAddress(),
    ETH_ADDRESS,
    amount
  );
  expect(result2).toBeDefined();
});

test.skip('ethereum-transfer-token', async () => {
  const account1 = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const account2 = await create({ network: NETWORK, mnemonic: OTHER_MNEMONIC });
  const amount = 1;
  const opts = {};
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
