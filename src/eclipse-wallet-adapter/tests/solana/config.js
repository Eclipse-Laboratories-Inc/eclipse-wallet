const { SOLANA } = require('../../constants/platforms');

const MNEMONIC = 'grow oblige neck same spend east come small dinosaur frost rice vintage';
const PUBLIC_KEY = '8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtzi';
const PRIVATE_KEY =
  '29upfNprAZDDbFDZyQuqeBjZf4HDN96Ag4V4CYVFcbVBTUnvUDvk6itVdE15dmBspND8ZLKGJdHZSFAcS11mFtke';
const TOKEN_ADDRESS = 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';
const NFT_ADDRESS = 'HBcZBEESoDJkwNkvciNMzyuZ2UrE5Q6RSH6mpqTAsHvV';

const NETWORK_DEVNET = {
  id: 'solana-devnet',
  blockchain: SOLANA,
  environment: 'devnet',
  name: 'Solana Devnet',
  icon: 'https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png',
  config: {
    nodeUrl: `https://api.devnet.solana.com`,
  },
};

const NETWORK_MAINNET = {
  id: 'solana-mainnet',
  blockchain: SOLANA,
  environment: 'mainnet',
  name: 'Solana main',
  icon: 'https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png',
  config: {
    nodeUrl: `https://api.mainnet-beta.solana.com`,
  },
};

module.exports = {
  MNEMONIC,
  PUBLIC_KEY,
  PRIVATE_KEY,
  TOKEN_ADDRESS,
  NETWORK_DEVNET,
  NETWORK_MAINNET,
  NFT_ADDRESS,
};
