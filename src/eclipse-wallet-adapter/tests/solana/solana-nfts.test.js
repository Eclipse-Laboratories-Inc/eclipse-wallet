const { create } = require('../../factories/solana-account-factory');
const { MNEMONIC, NETWORK_MAINNET, NFT_ADDRESS } = require('./config');

test.skip('solana-get-all-nfts', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const nfts = await account.getAllNfts();
  //console.log('all:', nfts);
  expect(nfts).toBeDefined();
  expect(nfts.length).toBeGreaterThan(0);
});

test.skip('solana-get-all-nfts-grouped', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const nfts = await account.getAllNftsGrouped();
  //console.log('grouped:', JSON.stringify(nfts));
  expect(nfts).toBeDefined();
  expect(nfts.length).toBeGreaterThan(0);
});

// Transfer test are skipped
test.skip('nft-create-token-account', async () => {
  const account1 = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC, index: 1 });
  const ta = await account1.getOrCreateTokenAccount(account2.keyPair.publicKey, NFT_ADDRESS);
  expect(ta).toBeDefined();
});

test.skip('solana-transfer-nft', async () => {
  const account1 = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC, index: 0 });
  const account2 = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC, index: 1 });
  const amount = 1;
  const transaction1 = await account1.createTransferTransaction(
    account2.publicKey.toBase58(),
    NFT_ADDRESS,
    amount
  );
  expect(transaction1).toBeDefined();
  const transaction2 = await account2.createTransferTransaction(
    account1.publicKey.toBase58(),
    NFT_ADDRESS,
    amount
  );
  expect(transaction2).toBeDefined();
});

test.skip('solana-list-nft', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const price = 1;
  const nftAddress = '39gPiYNJToZU16JrWzY97aAGJWsn8vVcw8bhCT2Ue7QV';
  //list nft
  const transaction = await account.listNft(nftAddress, price);
  //delist nft
  // const transaction = await account.listNft(nftAddress);
  //console.log('transaction', transaction);
  expect(transaction).toBeDefined();
});

test('solana-get-listed-nfts', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const nfts = await account.getListedNfts();
  //console.log('nfts', nfts);
  expect(nfts).toBeDefined();
});

test('solana-get-collection-group', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const collections = await account.getCollectionGroup('trending');
  //console.log('collections', collections);
  expect(collections).toBeDefined();
});

test('solana-get-collection', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const collection = await account.getCollection('Bq1WMyP1mX7EzfNiBwenSAJCnk5bVdPszZt3eESmesCx');
  //console.log('collection', collection);
  expect(collection).toBeDefined();
});

test('solana-get-collection-items', async () => {
  const account = await create({ network: NETWORK_MAINNET, mnemonic: MNEMONIC });
  const collectionItems = await account.getCollectionItems(
    'Bq1WMyP1mX7EzfNiBwenSAJCnk5bVdPszZt3eESmesCx'
  );
  //console.log('collection Items', collectionItems);
  expect(collectionItems).toBeDefined();
});
