const { BITCOIN } = require('../../constants/blockchains');

const MNEMONIC =
  'rubber account subject benefit fit front radar artist indicate behave reward drum';

const NETWORK = {
  id: 'bitcoin-testnet',
  blockchain: BITCOIN,
  environment: 'testnet',
  name: 'Bitcoin Testnet',
  icon: 'https://assets-cdn.trustwallet.com/blockchains/bitcoin/info/logo.png',
  config: {},
};

module.exports = { MNEMONIC, NETWORK };
