const SOLANA_EXPLORERS = {
  SOLSCAN: {
    name: 'Solscan',
    url: 'https://solscan.io/tx',
  },
  SOLANA_FM: {
    name: 'Solana FM',
    url: 'https://solana.fm/tx',
  },
  SOLANA_EXPLORER: {
    name: 'Solana Explorer',
    url: 'https://explorer.solana.com/tx',
  },
  SOLANA_BEACH: {
    name: 'Solana Beach',
    url: 'https://solanabeach.io/transaction',
  },
};

const EXPLORERS = {
  SOLANA: {
    mainnet: SOLANA_EXPLORERS,
    'mainnet-beta': SOLANA_EXPLORERS,
    testnet: SOLANA_EXPLORERS,
    devnet: SOLANA_EXPLORERS,
  },
  ETHEREUM: {
    mainnet: {
      ETHERSCAN: {
        name: 'Etherscan',
        url: 'https://etherscan.io/tx',
      },
    },
    goerli: {
      ETHERSCAN: {
        name: 'Etherscan',
        url: 'https://goerli.etherscan.io/tx',
      },
    },
  },
  NEAR: {
    mainnet: {
      NEAR_EXPLORER: {
        name: 'Near Explorer',
        url: 'https://explorer.near.org/transactions',
      },
    },
    testnet: {
      NEAR_EXPLORER: {
        name: 'Near Explorer',
        url: 'https://explorer.testnet.near.org/transactions',
      },
    },
  },
  BITCOIN: {
    mainnet: {
      BLOCKCYPHER: {
        name: 'Blockcypher',
        url: 'https://live.blockcypher.com/btc/tx',
      },
    },
    testnet: {
      BLOCKCYPHER: {
        name: 'Blockcypher',
        url: 'https://live.blockcypher.com/btc-testnet/tx',
      },
    },
  },
};

const DEFAULT_EXPLORERS = {
  SOLANA: 'SOLSCAN',
  NEAR: 'NEAR_EXPLORER',
  ETHEREUM: 'ETHERSCAN',
  BITCOIN: 'BLOCKCYPHER',
};

export { EXPLORERS, DEFAULT_EXPLORERS };
