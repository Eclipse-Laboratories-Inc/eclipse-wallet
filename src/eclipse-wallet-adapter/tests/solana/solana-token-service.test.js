const { create } = require('../../factories/solana-account-factory');
const { PublicKey } = require('@solana/web3.js');
const { MNEMONIC, TOKEN_ADDRESS, NETWORK_DEVNET } = require('./config');
const {
  getTokenAccount,
  getAssociatedTokenAddress,
} = require('../../services/solana/solana-token-service');

test('get-assoc-token-address', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const ata = await getAssociatedTokenAddress(
    new PublicKey(TOKEN_ADDRESS),
    account.keyPair.publicKey
  );
  expect(ata).toBeDefined();
  expect(ata.toBase58()).toBe('41CQSHF6XZwnfCmm31E63K3JvtTGEoFHrm4DF56uVF1u');
});

test('get-valid-token-account', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const tokenAccount = await getTokenAccount(
    await account.getConnection(),
    account.keyPair.publicKey,
    TOKEN_ADDRESS
  );
  expect(tokenAccount).toBeDefined();
});

test('get-invalid-token-account', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC, index: 9 });
  const tokenAccount = await getTokenAccount(
    await account.getConnection(),
    account.keyPair.publicKey,
    TOKEN_ADDRESS
  );
  expect(tokenAccount).toBeNull();
});
