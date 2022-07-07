import {
  createAccount as createAccount4m,
  restoreAccount,
  restoreDerivedAccounts,
} from '@4m/wallet-adapter';
import chains from '@4m/wallet-adapter/constants/chains';
import ENDPOINTS from '../config/endpoints';

const QTY_WORDS = [12, 24];
const MIN_WORD = 3;

export const LOGOS = {
  SOLANA:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
  NEAR: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
};

export const createAccount = (chain, endpoint) =>
  createAccount4m(chains[chain], { endpoint });

export const recoverAccount = (chain, mnemonic, endpoint) =>
  restoreAccount(chains[chain], mnemonic, { endpoint });

export const getDerivedAccounts = (chain, mnemonic, endpoint) =>
  restoreDerivedAccounts(chains[chain], mnemonic, { endpoint });

export const getChains = () => Object.keys(chains);

export const getDefaultChain = () => 'SOLANA';

export const getDefaultEndpoint = chain => ENDPOINTS[chain].MAIN;

export const validateSeedPhrase = seedPhrase =>
  seedPhrase.length &&
  QTY_WORDS.includes(seedPhrase.split(' ').length) &&
  seedPhrase.split(' ').every(word => word.length >= MIN_WORD);

export const getWalletName = (wallet, number) => `Wallet ${number}`;
