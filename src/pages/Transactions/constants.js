const TRANSACTION_TYPE = {
  SEND: 'send',
  RECEIVE: 'receive',
  SWAP: 'swap',
  UNKNOWN: 'unknown',
};

const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const TOKEN_DECIMALS = {
  SOLANA: 1000000000,
  NEAR: 1000000000000000000000000,
  ETHEREUM: 1000000000000000000,
  COINS: 1000000,
};

const DEFAULT_SYMBOL = {
  SOLANA: 'SOL',
  NEAR: 'NEAR',
  ETHEREUM: 'ETH',
};

const SOL_ICON =
  'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';

export {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
  TOKEN_DECIMALS,
  DEFAULT_SYMBOL,
  SOL_ICON,
};
