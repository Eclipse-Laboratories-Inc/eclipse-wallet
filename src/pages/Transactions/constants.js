const TRANSACTION_TYPE = {
  TRANSFER: 'transfer',
  TRANSFER_CHECKED: 'transferChecked',
  GET_ACC_DATA: 'getAccountDataSize',
  SWAP: 'swap',
  CLOSE_ACCOUNT: 'closeAccount',
  CREATE_ACCOUNT: 'createAccount',
  CREATE: 'create',
};

const TYPES_MAP = {
  closeAccount: 'Close account',
  create: 'Create account',
  createAccount: 'Create account',
};

const TOKEN_DECIMALS = {
  SOLANA: 1000000000,
  COINS: 1000000,
};

const SOL_ICON =
  'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';

export { TYPES_MAP, TRANSACTION_TYPE, TOKEN_DECIMALS, SOL_ICON };
