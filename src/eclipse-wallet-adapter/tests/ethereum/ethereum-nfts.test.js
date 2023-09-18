const { create } = require('../../factories/ethereum-account-factory');
const { NETWORK, MNEMONIC, OTHER_MNEMONIC, NFT_TOKEN_NAME } = require('./config');

test.skip('ethereum-get-all-nfts', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const nfts = await account.getAllNfts();
  expect(nfts).toBeDefined();
  expect(nfts.length).toBeGreaterThan(0);
});

test.skip('ethereum-get-all-nfts-grouped', async () => {
  const account = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const nfts = await account.getAllNftsGrouped();
  expect(nfts).toBeDefined();
  expect(nfts.length).toBeGreaterThan(0);
});

test.skip('ethereum-transfer-nft', async () => {
  const account1 = await create({ network: NETWORK, mnemonic: MNEMONIC });
  const account2 = await create({ network: NETWORK, mnemonic: OTHER_MNEMONIC });
  const result1 = await account1.createTransferTransaction(
    account2.getReceiveAddress(),
    NFT_TOKEN_NAME,
    1
  );
  expect(result1).toBeDefined();
  const result2 = await account2.createTransferTransaction(
    account1.getReceiveAddress(),
    NFT_TOKEN_NAME,
    1
  );
  expect(result2).toBeDefined();
});
