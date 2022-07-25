import {
  createAccount as createAccount4m,
  restoreAccount,
  restoreDerivedAccounts,
} from '@4m/wallet-adapter';
import chains from '@4m/wallet-adapter/constants/chains';

import ENDPOINTS from '../config/endpoints';

import IconTransactionSent from '../assets/images/IconTransactionSent.png';
import IconTransactionReceived from '../assets/images/IconTransactionReceived.png';
import IconTransactionSwap from '../assets/images/IconTransactionSwap.png';
import IconTransactionInteraction from '../assets/images/IconTransactionInteraction.png';
import IconTransactionPaid from '../assets/images/IconTransactionPaid.png';
import IconTransactionResultSuccess from '../assets/images/IconTransactionResultSuccess.png';
import IconTransactionResultWarning from '../assets/images/IconTransactionResultWarning.png';
import IconTransactionResultFail from '../assets/images/IconTransactionResultFail.png';

const QTY_WORDS = [12, 24];
const MIN_WORD = 3;

export const LOGOS = {
  SOLANA:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
  NEAR: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
};

export const createAccount = (chain, endpoint) =>
  createAccount4m(chains[chain], { networkId: endpoint });

export const recoverAccount = (chain, mnemonic, endpoint) =>
  restoreAccount(chains[chain], mnemonic, { networkId: endpoint });

export const getDerivedAccounts = (chain, mnemonic, endpoint) =>
  restoreDerivedAccounts(chains[chain], mnemonic, { networkId: endpoint });

export const getChains = () => Object.keys(chains);

export const getDefaultChain = () => 'SOLANA';

export const getDefaultEndpoint = chain => ENDPOINTS[chain].MAIN;

export const validateSeedPhrase = seedPhrase =>
  seedPhrase.length &&
  QTY_WORDS.includes(seedPhrase.split(' ').length) &&
  seedPhrase.split(' ').every(word => word.length >= MIN_WORD);

export const getWalletName = (wallet, number) => `Wallet ${number}`;

export const getWalletChain = wallet => {
  const type = wallet.constructor.name;
  switch (type) {
    case 'SolanaAccount':
      return 'SOLANA';
    case 'NearAccount':
      return 'NEAR';
    default:
      return getDefaultChain();
  }
};

export const getShortAddress = address =>
  `${address.substr(0, 4)}...${address.substr(-4)}`;

export const getTransactionImage = transaction => {
  const object = transaction;
  switch (object) {
    case 'sent':
      return IconTransactionSent;
    case 'received':
      return IconTransactionReceived;
    case 'swap':
      return IconTransactionSwap;
    case 'interaction':
      return IconTransactionInteraction;
    case 'paid':
      return IconTransactionPaid;
    case 'success':
      return IconTransactionResultSuccess;
    case 'warning':
      return IconTransactionResultWarning;
    case 'fail':
      return IconTransactionResultFail;
    default:
      return IconTransactionSent;
  }
};
