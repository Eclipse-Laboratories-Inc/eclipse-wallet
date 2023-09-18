const { create } = require('../../factories/solana-account-factory');
const { MNEMONIC, PUBLIC_KEY, PRIVATE_KEY, NETWORK_DEVNET, NETWORK_MAINNET } = require('./config');

test('solana-account-get-private-key', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const pk = await account.retrieveSecurePrivateKey();
  expect(pk).toBe(PRIVATE_KEY);
});

test('solana-account-get-balance', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const balance = await account.getBalance();
  expect(balance.usdTotal).toBeGreaterThanOrEqual(0);
  expect(balance.items.length).toBeGreaterThan(0);
});

test('solana-validate-destination-account', async () => {
  const account1 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 5 });

  const addr1 = 'GxV4RRUsjs1rZwo6e2fvtjXXK6aYKCYJx4bv1N';
  const addr2 = '8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtRR';
  const addr3 = '8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtzi';
  const addr4 = account2.publicKey.toBase58();

  const result1 = await account1.validateDestinationAccount(addr1);
  expect(result1.code).toBe('INVALID_ADDRESS');
  expect(result1.type).toBe('ERROR');
  const result2 = await account1.validateDestinationAccount(addr2);
  expect(result2.code).toBe('EMPTY_ACCOUNT');
  expect(result2.type).toBe('WARNING');
  const result3 = await account1.validateDestinationAccount(addr3);
  expect(result3.code).toBe('VALID_ACCOUNT');
  expect(result3.type).toBe('SUCCESS');
  const result4 = await account1.validateDestinationAccount(addr4);
  expect(result4.code).toBe('EMPTY_ACCOUNT');
  expect(result4.type).toBe('WARNING');
});

test('solana-validate-destination-domain', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC }); // TODO mainnet-beta

  const addr1 = 'salmonwallet';
  const addr2 = 'salmon-wallet.sol';

  const result1 = await account.validateDestinationAccount(addr1);
  expect(result1.code).toBe('VALID_ACCOUNT');
  expect(result1.type).toBe('SUCCESS');
  const result2 = await account.validateDestinationAccount(addr2);
  expect(result2.code).toBe('INVALID_ADDRESS');
  expect(result2.type).toBe('ERROR');
});

test('solana-account-get-tokens', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const tokens = await account.getTokens();
  expect(tokens.length).toBeGreaterThan(0);
});

test('solana-account-get-receive-address', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const receiveAddress = await account.getReceiveAddress();
  expect(receiveAddress).toBeDefined();
  expect(receiveAddress).toBe(PUBLIC_KEY);
});

test('solana-get-network', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const network = account.network;
  expect(network).toBeDefined();
  expect(network).toBe(NETWORK_DEVNET);
});

test('solana-get-transactions', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const transactions = await account.getRecentTransactions({ pageSize: 8 });

  expect(transactions.data.length).toBe(8);
});
