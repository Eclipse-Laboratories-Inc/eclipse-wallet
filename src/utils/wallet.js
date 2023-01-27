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

export const validateSeedPhrase = seedPhrase =>
  seedPhrase.length &&
  QTY_WORDS.includes(seedPhrase.split(' ').length) &&
  seedPhrase.split(' ').every(word => word.length >= MIN_WORD);

export const getShortAddress = address =>
  `${address.substr(0, 4)}...${address.substr(-4)}`;

export const TRANSACTION_STATUS = {
  FAIL: 'fail',
  SUCCESS: 'success',
  WARNING: 'warning',
  CREATING: 'creating',
  SENDING: 'sending',
  LISTING: 'listing',
  UNLISTING: 'unlisting',
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
    case 'inProgress':
      return IconTransactionSent;
    case 'swapping':
      return IconTransactionSending;
    case 'listing':
      return IconTransactionSending;
    case 'unlisting':
      return IconTransactionSending;
    case 'burning':
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
