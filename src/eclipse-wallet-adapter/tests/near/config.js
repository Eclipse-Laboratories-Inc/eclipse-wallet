const { NEAR } = require('../../constants/blockchains');

const MNEMONIC = 'skill brisk position that slush giant fetch letter glue unknown captain whale';
const PUBLIC_KEY = '14t8U9X6US1fN1J7eiXDqPjrJkyxD6BQGxtDwL4AvTfi';
const ACCOUNT_ID = 'hernando.testnet';

const IMPLICIT_MNEMONIC =
  'define cause cool junk upset sunset chaos party transfer distance liar smart garbage pull alarm subway attract scrub road genius maid capital rely under';
const IMPLICIT_ACCOUNT_ID = '485d55386287a4330cb2545ba8cde2572947ee561d9709c419261ddb8c1f2962';

const TOKEN_NAME = 'wrap.testnet';
const NFT_TOKEN_NAME = 'nft.examples.testnet';
const NFT_TOKEN_ID = 'salmon.nft.test';

const NETWORK = {
  id: 'near-testnet',
  blockchain: NEAR,
  environment: 'testnet',
  name: 'Near Testnet',
  icon: 'https://assets-cdn.trustwallet.com/blockchains/near/info/logo.png',
  config: {
    nodeUrl: 'https://rpc.testnet.near.org',
    archivalNodeUrl: 'https://archival-rpc.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    indexerUrl: 'https://testnet-api.kitwallet.app',
    nearTokenId: 'wrap.testnet',
    refFinance: {
      apiUrl: 'https://dev-indexer.ref-finance.com',
      contractId: 'ref-finance-101.testnet',
    },
  },
};

module.exports = {
  MNEMONIC,
  PUBLIC_KEY,
  ACCOUNT_ID,
  IMPLICIT_MNEMONIC,
  IMPLICIT_ACCOUNT_ID,
  TOKEN_NAME,
  NFT_TOKEN_NAME,
  NFT_TOKEN_ID,
  NETWORK,
};
