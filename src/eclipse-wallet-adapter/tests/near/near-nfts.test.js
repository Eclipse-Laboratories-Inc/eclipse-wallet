const { create } = require('../../factories/near-account-factory');
const { NETWORK, MNEMONIC, IMPLICIT_MNEMONIC, NFT_TOKEN_NAME, NFT_TOKEN_ID } = require('./config');

test('near-get-all-nfts', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const nfts = await account.getAllNfts();
  expect(nfts).toBeDefined();
  expect(nfts.length).toBeGreaterThan(0);
});

test('near-get-all-nfts-grouped', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const nfts = await account.getAllNftsGrouped();
  expect(nfts).toBeDefined();
  expect(nfts.length).toBeGreaterThan(0);
});

test.skip('near-transfer-nft', async () => {
  const account1 = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const account2 = await create({ network: NETWORK, mnemonic: IMPLICIT_MNEMONIC });
  const result1 = await account1.createTransferTransaction(
    account2.getReceiveAddress(),
    NFT_TOKEN_NAME,
    NFT_TOKEN_ID
  );
  expect(result1).toBeDefined();
  const result2 = await account2.createTransferTransaction(
    account1.getReceiveAddress(),
    NFT_TOKEN_NAME,
    NFT_TOKEN_ID
  );
  expect(result2).toBeDefined();
});
