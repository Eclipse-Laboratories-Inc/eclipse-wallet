const { ETHEREUM } = require('../../constants/blockchains');

const MNEMONIC = 'side lemon pool decrease kiss dune border nut barrel outer north fever';

const OTHER_MNEMONIC =
  'dove lumber quote board young robust kit invite plastic regular skull history';

const PUBLIC_KEY = '5iNXgcYL4uyJ5CBN86LXoK8mbBkeZ7k5h4rrbPNZp14K';

const TOKEN_NAME = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

const NFT_TOKEN_NAME = '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b';

const NETWORK = {
  id: 'ethereum-goerli',
  blockchain: ETHEREUM,
  environment: 'goerli',
  name: 'Ethereum Goerli',
  icon: 'https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png',
  config: {
    chainId: 5,
    openSeaUrl: 'https://testnets-api.opensea.io/api',
  },
};

module.exports = { MNEMONIC, OTHER_MNEMONIC, TOKEN_NAME, NFT_TOKEN_NAME, PUBLIC_KEY, NETWORK };
