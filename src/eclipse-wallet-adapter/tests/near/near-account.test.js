const { create } = require('../../factories/near-account-factory');
const {
  NETWORK,
  MNEMONIC,
  ACCOUNT_ID,
  IMPLICIT_MNEMONIC,
  IMPLICIT_ACCOUNT_ID,
} = require('./config');

test('near-account-get-balance', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const balance = await account.getBalance();
  expect(balance.usdTotal).toBeGreaterThanOrEqual(0);
  expect(balance.items.length).toBeGreaterThan(0);
});

test('near-validate-destination-account', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });

  const addr1 = 'a wewe';
  const addr2 = '8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtRR8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6Tb';
  const addr3 = '98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6dg';
  const addr4 = '98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6de';
  const addr5 = ACCOUNT_ID;

  const result1 = await account.validateDestinationAccount(addr1);
  expect(result1.code).toBe('INVALID_ADDRESS');
  expect(result1.type).toBe('ERROR');
  const result2 = await account.validateDestinationAccount(addr2);
  expect(result2.code).toBe('INVALID_ADDRESS');
  expect(result2.type).toBe('ERROR');
  const result3 = await account.validateDestinationAccount(addr3);
  expect(result3.code).toBe('EMPTY_ACCOUNT');
  expect(result3.type).toBe('WARNING');
  const result4 = await account.validateDestinationAccount(addr4);
  expect(result4.code).toBe('VALID_ACCOUNT');
  expect(result4.type).toBe('SUCCESS');
  const result5 = await account.validateDestinationAccount(addr5);
  expect(result5.code).toBe('VALID_ACCOUNT');
  expect(result5.type).toBe('SUCCESS');
});

test('near-account-get-tokens', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const tokens = await account.getTokens();
  expect(tokens.length).toBeGreaterThan(0);
});

test('near-account-get-receive-address', async () => {
  const account = await create({ network: NETWORK, mnemonic: IMPLICIT_MNEMONIC });
  const receiveAddress = await account.getReceiveAddress();
  expect(receiveAddress).toBeDefined();
  expect(receiveAddress).toBe(IMPLICIT_ACCOUNT_ID);
});

test('near-get-network', async () => {
  const account = await create({ network: NETWORK, mnemonic: IMPLICIT_MNEMONIC });
  const network = account.network;
  expect(network).toBeDefined();
  expect(network).toBe(NETWORK);
});

test('near-get-transactions', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const transactions = await account.getRecentTransactions({
    // nextPageToken: '21gTGTwCZAksvwpCXw8V1ZZzBaAbEWz9ApGm9qC6sYTj',
    pageSize: 8,
  });
  //console.log(JSON.stringify(transactions, '', 4));
  // const size = transactions.length;
  // expect(size).toBe(10);
});

test('near-get-transaction', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const transaction = await account.getTransaction('21gTGTwCZAksvwpCXw8V1ZZzBaAbEWz9ApGm9qC6sYTj');
  //console.log('transaction', transaction);
  // const size = transactions.length;
  // expect(size).toBe(10);
});
