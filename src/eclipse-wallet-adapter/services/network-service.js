let promise;

const networkData = [
    {
        "id": "ethereum-mainnet",
        "blockchain": "ethereum",
        "environment": "mainnet",
        "name": "Ethereum",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png",
        "currency": {
            "symbol": "ETH",
            "decimals": 18
        },
        "config": {
            "chainId": 1,
            "openSeaUrl": "https://api.opensea.io/api"
        }
    },
    {
        "id": "ethereum-goerli",
        "blockchain": "ethereum",
        "environment": "goerli",
        "name": "Ethereum Goerli",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png",
        "currency": {
            "symbol": "ETH",
            "decimals": 18
        },
        "config": {
            "chainId": 5,
            "openSeaUrl": "https://testnets-api.opensea.io/api"
        }
    },
    {
        "id": "solana-mainnet",
        "blockchain": "solana",
        "environment": "mainnet",
        "name": "Solana",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png",
        "currency": {
            "symbol": "SOL",
            "decimals": 9
        },
        "config": {
            "nodeUrl": "https://solana-api.syndica.io/access-token/GihB7MDgiHYn8jy0JKZTVEVHzMBKSKPZnrMxMNxyb3h9Wf637lklI4AxyTdNlw8Z/rpc"
        }
    },
    {
        "id": "solana-testnet",
        "blockchain": "solana",
        "environment": "testnet",
        "name": "Solana Testnet",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png",
        "currency": {
            "symbol": "SOL",
            "decimals": 9
        },
        "config": {
            "nodeUrl": "https://api.testnet.solana.com"
        }
    },
    {
        "id": "solana-devnet",
        "blockchain": "solana",
        "environment": "devnet",
        "name": "Solana Devnet",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png",
        "currency": {
            "symbol": "SOL",
            "decimals": 9
        },
        "config": {
            "nodeUrl": "https://api.devnet.solana.com"
        }
    },
    {
        "id": "near-mainnet",
        "blockchain": "near",
        "environment": "mainnet",
        "name": "Near",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/near/info/logo.png",
        "currency": {
            "symbol": "NEAR",
            "decimals": 24
        },
        "config": {
            "nodeUrl": "https://rpc.mainnet.near.org",
            "archivalNodeUrl": "https://archival-rpc.mainnet.near.org",
            "helperUrl": "https://helper.mainnet.near.org",
            "indexerUrl": "https://api.kitwallet.app",
            "nearTokenId": "wrap.near",
            "refFinance": {
                "apiUrl": "https://indexer.ref.finance",
                "contractId": "v2.ref-finance.near"
            }
        }
    },
    {
        "id": "near-testnet",
        "blockchain": "near",
        "environment": "testnet",
        "name": "Near Testnet",
        "icon": "https://assets-cdn.trustwallet.com/blockchains/near/info/logo.png",
        "currency": {
            "symbol": "NEAR",
            "decimals": 24
        },
        "config": {
            "nodeUrl": "https://rpc.testnet.near.org",
            "archivalNodeUrl": "https://archival-rpc.testnet.near.org",
            "helperUrl": "https://helper.testnet.near.org",
            "indexerUrl": "https://testnet-api.kitwallet.app",
            "nearTokenId": "wrap.testnet",
            "refFinance": {
                "apiUrl": "https://dev-indexer.ref-finance.com",
                "contractId": "ref-finance-101.testnet"
            }
        }
    }
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