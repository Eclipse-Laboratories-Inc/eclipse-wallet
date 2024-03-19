let promise;

const networkData = [
  {
    id: 'solana-devnet',
    blockchain: 'solana',
    environment: 'devnet',
    name: 'Eclipse Devnet',
    icon: 'https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png',
    currency: {
      symbol: 'ETH',
      decimals: 9,
    },
    config: {
      nodeUrl: 'https://staging-rpc.dev2.eclipsenetwork.xyz',
    },
  },
  {
    id: 'solana-testnet',
    blockchain: 'solana',
    environment: 'devnet',
    name: 'Eclipse Testnet',
    icon: 'https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png',
    currency: {
      symbol: 'ETH',
      decimals: 9,
    },
    config: {
      nodeUrl: 'https://testnet.dev2.eclipsenetwork.xyz',
    },
  },
  {
    id: 'ethereum-mainnet',
    blockchain: 'ethereum',
    environment: 'mainnet',
    name: 'Ethereum',
    icon: 'https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png',
    currency: {
      symbol: 'ETH',
      decimals: 18,
    },
    config: {
      chainId: 1,
      openSeaUrl: 'https://api.opensea.io/api',
    },
  },
  {
    id: 'ethereum-goerli',
    blockchain: 'ethereum',
    environment: 'goerli',
    name: 'Ethereum Goerli',
    icon: 'https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png',
    currency: {
      symbol: 'ETH',
      decimals: 18,
    },
    config: {
      chainId: 5,
      openSeaUrl: 'https://testnets-api.opensea.io/api',
    },
  },
  // {
  //     "id": "solana-mainnet",
  //     "blockchain": "solana",
  //     "environment": "mainnet",
  //     "name": "Solana",
  //     "icon": "https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png",
  //     "currency": {
  //         "symbol": "SOL",
  //         "decimals": 9
  //     },
  //     "config": {
  //         "nodeUrl": "https://solana-api.syndica.io/access-token/GihB7MDgiHYn8jy0JKZTVEVHzMBKSKPZnrMxMNxyb3h9Wf637lklI4AxyTdNlw8Z/rpc"
  //     }
  // },
];

const getNetworks = async () => {
  if (promise) {
    return promise;
  }

  promise = Promise.resolve(networkData);

  try {
    return await promise;
  } catch (error) {
    promise = null;
    throw error;
  }
};

const getNetwork = async (id) => {
  const networks = await getNetworks();
  return networks?.find((network) => network.id === id);
};

module.exports = { getNetwork, getNetworks };