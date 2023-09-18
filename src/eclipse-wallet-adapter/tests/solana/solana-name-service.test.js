const { create } = require('../../factories/solana-account-factory');
const { MNEMONIC, NETWORK_MAINNET } = require('./config');

test('solana-get-bonfida-domain', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const name = await account.getDomainFromPublicKey('Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb');
  expect(name).toBe('bonfida');
});

test('solana-get-bonfida-my-domain', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const name = await account.getDomain();
  expect(name).toBe(null);
});

test('solana-get-bonfida-key', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const pk = await account.getPublicKeyFromDomain('bonfida.sol');
  expect(pk).toBe('HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA');
});
