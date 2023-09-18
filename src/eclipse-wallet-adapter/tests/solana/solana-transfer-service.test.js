const { create } = require('../../factories/solana-account-factory');
const { SOL_ADDRESS } = require('../../constants/token-constants');
const { MNEMONIC, TOKEN_ADDRESS, NETWORK_DEVNET } = require('./config');

test.only('solana-estimate-fee-transfer-sol', async () => {
  const account1 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 1 });
  const amount = 0.2;
  const fee = await account1.estimateTransferFee(
    account2.publicKey.toBase58(),
    SOL_ADDRESS,
    amount
  );
  console.log(`Transaction estimated fee ${fee}`);
});

test.only('solana-estimate-fee-transfer-token', async () => {
  const account1 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 1 });
  const amount = 10;
  const fee = await account1.estimateTransferFee(
    account2.publicKey.toBase58(),
    TOKEN_ADDRESS,
    amount
  );
  console.log(`Transaction estimated fee ${fee}`);
});

test.only('solana-transfer-sol', async () => {
  const account1 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 1 });
  const amount = 0.2;
  const opts = { simulate: false };
  const result1 = await account1.createTransferTransaction(
    account2.publicKey.toBase58(),
    SOL_ADDRESS,
    amount,
    opts
  );
  expect(result1).toBeDefined();
  console.log(`Transaction sign ${result1}`);
  const result2 = await account2.createTransferTransaction(
    account1.publicKey.toBase58(),
    SOL_ADDRESS,
    amount,
    opts
  );
  expect(result2).toBeDefined();
  console.log(`Transaction sign ${result2}`);
});

test.only('solana-transfer-token', async () => {
  const account1 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 1 });
  const amount = 11;
  const opts = { simulate: false };
  const result1 = await account1.createTransferTransaction(
    account2.publicKey.toBase58(),
    TOKEN_ADDRESS,
    amount,
    opts
  );
  expect(result1).toBeDefined();
  console.log(`Transaction sign ${result1}`);
  const result2 = await account2.createTransferTransaction(
    account1.publicKey.toBase58(),
    TOKEN_ADDRESS,
    amount,
    opts
  );
  expect(result2).toBeDefined();
  console.log(`Transaction sign ${result2}`);
});

test.skip('solana-confirm-transfer', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const result = await account.confirmTransferTransaction(
    '5961UKhCvGsYdYQRzNAARPhqg1jg8gkn6oijahWVUMsMX6Z7EgZSX8fmDAXVcYLvBGLvxSbrKp8YKB86YFbiYW6p'
  );
  expect(result).toBeDefined();
  console.log(`Transaction id ${JSON.stringify(result)}`);
});

/*
test('solana-account-airdrop', async() => {    
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const result = await account.airdrop(1);
  console.log(JSON.stringify(result, null, "\t"));
});
*/
