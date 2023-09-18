const { create } = require('../../factories/ethereum-account-factory');
const { NETWORK, MNEMONIC } = require('./config');

test.skip('ethereum-account-get-balance', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const balance = await account.getBalance();
  expect(balance.usdTotal).toBeGreaterThanOrEqual(0);
  expect(balance.items.length).toBeGreaterThan(0);
});

test('ethereum-validate-destination-account', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });

  const addr1 = 'ehuffubffberkfbr';
  const addr2 = '0x5e3f1d95cB1A7323c2fF17EFa5c67156cA720604';
  const addr3 = '0xA1EeF099573D95273103FB384B7013283A729111';

  const result1 = await account.validateDestinationAccount(addr1);
  expect(result1.code).toBe('INVALID_ADDRESS');
  expect(result1.type).toBe('ERROR');
  const result2 = await account.validateDestinationAccount(addr2);
  expect(result2.code).toBe('NO_FUNDS');
  expect(result2.type).toBe('WARNING');
  /*
  const result3 = await account.validateDestinationAccount(addr3);
  expect(result3.code).toBe('VALID_ACCOUNT');
  expect(result3.type).toBe('SUCCESS');
  */
});

test('ethereum-account-get-tokens', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const tokens = await account.getTokens();
  expect(tokens.length).toBeGreaterThan(0);
});

test('ethereum-account-get-receive-address', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const receiveAddress = await account.getReceiveAddress();
  expect(receiveAddress).toBeDefined();
  expect(receiveAddress).toBe('0x5e3f1d95cB1A7323c2fF17EFa5c67156cA720604');
});

test('ethereum-get-network', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const network = account.network;
  expect(network).toBeDefined();
  expect(network).toBe(NETWORK);
});

test.skip('ethereum-get-transactions', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const { data } = await account.getRecentTransactions({ pageSize: 8 });
  expect(data.length).toBe(10);
});

test.skip('ethereum-get-transaction', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const transaction = await account.getTransaction('21gTGTwCZAksvwpCXw8V1ZZzBaAbEWz9ApGm9qC6sYTj');
  expect(transaction).toBeDefined();
});
