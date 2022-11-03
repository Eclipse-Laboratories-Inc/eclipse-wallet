import {
  createAccount as createAccount4m,
  restoreAccount,
  restoreDerivedAccounts,
  getAvailableTokens as getAvailableTokens4m,
  getFeaturedTokens as getFeaturedTokens4m,
} from '4m-wallet-adapter';
import chains from '4m-wallet-adapter/constants/chains';
import get from 'lodash/get';

import ENDPOINTS from '../config/endpoints';

import IconTransactionSent from '../assets/images/IconTransactionSent.png';
import IconTransactionReceived from '../assets/images/IconTransactionReceived.png';
import IconTransactionSwap from '../assets/images/IconTransactionSwap.png';
import IconTransactionInteraction from '../assets/images/IconTransactionInteraction.png';
import IconTransactionPaid from '../assets/images/IconTransactionPaid.png';
import IconTransactionUnknown from '../assets/images/IconTransactionUnknown.png';
import IconTransactionResultSuccess from '../assets/images/IconTransactionResultSuccess.png';
import IconTransactionResultWarning from '../assets/images/IconTransactionResultWarning.png';
import IconTransactionResultFail from '../assets/images/IconTransactionResultFail.png';
import IconTransactionCreating from '../assets/images/IconTransactionCreating.png';
import IconTransactionSending from '../assets/images/IconTransactionSending.gif';

const QTY_WORDS = [12, 24];
const MIN_WORD = 3;

export const LOGOS = {
  SOLANA:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
  NEAR: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
  ETHEREUM:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
};

export const createAccount = (chain, endpoint) =>
  createAccount4m(chains[chain], { networkId: endpoint });

export const recoverAccount = (chain, mnemonic, endpoint) =>
  restoreAccount(chains[chain], mnemonic, { networkId: endpoint });

export const getDerivedAccounts = (chain, mnemonic, endpoint) =>
  restoreDerivedAccounts(chains[chain], mnemonic, { networkId: endpoint });

export const recoverDerivedAccount = async (
  chain,
  mnemonic,
  path,
  endpoint,
) => {
  const derivedAccounts = await restoreDerivedAccounts(
    chains[chain],
    mnemonic,
    {
      networkId: endpoint,
    },
  );
  return derivedAccounts.filter(
    acc => acc.mnemonic === mnemonic && acc.path === path,
  )[0];
};

//export const getChains = () => Object.keys(chains);
export const getChains = () => ['SOLANA'];

export const getDefaultChain = () => 'SOLANA';

export const getDefaultEndpoint = chain => ENDPOINTS[chain].MAIN;

export const validateSeedPhrase = seedPhrase =>
  seedPhrase.length &&
  QTY_WORDS.includes(seedPhrase.split(' ').length) &&
  seedPhrase.split(' ').every(word => word.length >= MIN_WORD);

export const getWalletName = (address, config) =>
  get(config, `${address}.name`, 'Wallet Unknown');

export const getWalletAvatar = (address, config) =>
  get(
    config,
    `${address}.avatar`,
    'http://static.salmonwallet.io/avatar/00.png',
  );

export const getWalletChain = wallet => {
  const type = wallet ? wallet.chain : '';
  if (type) {
    return type.toUpperCase();
  }
  return getDefaultChain();
};

export const getShortAddress = address =>
  address && `${address.substr(0, 4)}...${address.substr(-4)}`;

export const TRANSACTION_STATUS = {
  FAIL: 'fail',
  SUCCESS: 'success',
  WARNING: 'warning',
  CREATING: 'creating',
  SENDING: 'sending',
  LISTING: 'listing',
  UNLISTING: 'unlisting',
  CREATING_OFFER: 'creating-offer',
  CANCELING_OFFER: 'canceling-offer',
  SWAPPING: 'swapping',
};

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
    case 'unknown':
      return IconTransactionUnknown;
    case 'success':
      return IconTransactionResultSuccess;
    case 'warning':
      return IconTransactionResultWarning;
    case 'fail':
      return IconTransactionResultFail;
    case 'creating':
      return IconTransactionCreating;
    case 'sending':
      return IconTransactionSending;
    case 'swapping':
      return IconTransactionSending;
    case 'listing':
      return IconTransactionSending;
    case 'unlisting':
      return IconTransactionSending;
    case 'creating-offer':
      return IconTransactionSending;
    case 'canceling-offer':
      return IconTransactionSending;
    default:
      return IconTransactionSent;
  }
};

export const getNonListedTokens = (balance, nfts) =>
  balance.items?.filter(
    tok => !tok.name && !!Object.values(nfts).includes(tok.mint),
  );

export const getListedTokens = balance =>
  balance.items?.filter(tok => tok.name);

export const getAvailableTokens = getAvailableTokens4m;

export const getFeaturedTokens = getFeaturedTokens4m;
