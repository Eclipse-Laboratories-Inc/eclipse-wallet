const { create } = require('../../factories/bitcoin-account-factory');
const { NETWORK } = require('./config');

test.only('bitcoin-transfer', async () => {
  const MNEMONIC = 'stage opera giant believe slush shell kitchen record agree lock lemon typical';
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const receiver = 'mhuNkz8tXNfkdUr2kSqbAFkFprXvpvEkya';
  const { executableTx } = await account.createTransferTransaction(receiver, null, 0.00001);

  expect(executableTx).toBeDefined();
  const confirmResult = await account.confirmTransferTransaction(executableTx);
  console.log(confirmResult);
});
