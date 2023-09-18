const { generateMnemonic, generateKeyPair } = require('../services/seed-service');

const { MNEMONIC: SOLANA_MNEMONIC, PUBLIC_KEY: SOLANA_PUBLIC_KEY } = require('./solana/config');
const { MNEMONIC: NEAR_MNEMONIC, PUBLIC_KEY: NEAR_PUBLIC_KEY } = require('./near/config');
const {
  MNEMONIC: ETHEREUM_MNEMONIC,
  PUBLIC_KEY: ETHEREUM_PUBLIC_KEY,
} = require('./ethereum/config');

test('generate-mnemonic', async () => {
  const mnemonic = await generateMnemonic();
  expect(mnemonic).toBeDefined();
  expect(12).toBe(mnemonic.split(' ').length);
});

test('generate-solana-keypair', async () => {
  const keyPair = await generateKeyPair(SOLANA_MNEMONIC, `m/44'/501'/0'/0'`);
  expect(keyPair).toBeDefined();
  expect(keyPair.publicKey.toBase58()).toBe(SOLANA_PUBLIC_KEY);
});

test('generate-near-keypair', async () => {
  const keyPair = await generateKeyPair(NEAR_MNEMONIC, `m/44'/397'/0'`);
  expect(keyPair).toBeDefined();
  expect(keyPair.publicKey.toBase58()).toBe(NEAR_PUBLIC_KEY);
});

test('generate-ethereum-keypair', async () => {
  const keyPair = await generateKeyPair(ETHEREUM_MNEMONIC, `m/44'/60'/0'/0'`);
  expect(keyPair).toBeDefined();
  expect(keyPair.publicKey.toBase58()).toBe(ETHEREUM_PUBLIC_KEY);
});
