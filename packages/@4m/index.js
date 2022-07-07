const tokens = [
  {
    symbol: '$',
    name: 'SOL',
    decimals: '20',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    address: '0asd33d2d2d',
    chainId: '1234',
  },
  {
    symbol: '$',
    name: 'SOL',
    decimals: '20',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    address: '1asd33d2d2d',
    chainId: '1234',
  },
  {
    symbol: '$',
    name: 'SOL',
    decimals: '20',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    address: '2asd33d2d2d',
    chainId: '1234',
  },
  {
    symbol: '$',
    name: 'SOL',
    decimals: '20',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    address: '3asd33d2d2d',
    chainId: '1234',
  },
];

const nfts = [
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
  {
    image:
      'https://cryptohasbullanft.com/wp-content/uploads/2022/05/fuffy2.jpg',
  },
];

module.exports = {
  createAccount: () =>
    Promise.resolve({
      mnemonic:
        'dilemma usage defy sad adapt balcony olive obey glare pole push surprise risk useful calm ketchup mouse side bulb race hole excess finger address',
      path: "m/44'/501'/0'/0",
      getReceiveAddress: () => 'EgDXCQsXyomDckpX2eeBfSLQfNQa3kW3NKttXFN6QLPU',
      getBalance: () =>
        Promise.resolve({
          usdTotal: '1,100.02',
        }),
      getTokens: () => Promise.resolve([...tokens]),
      getAllNfts: () => Promise.resolve([...nfts]),
    }),
  restoreAccount: () =>
    Promise.resolve({
      mnemonic:
        'dilemma usage defy sad adapt balcony olive obey glare pole push surprise risk useful calm ketchup mouse side bulb race hole excess finger address',
      path: "m/44'/501'/0'/0",
      getReceiveAddress: () => '2PeXCQsXyomDckpX2eeBfSLQfNQa3kW3NKttXFN6QLPU',
      getBalance: () =>
        Promise.resolve({
          usdTotal: '1,200.02',
        }),
      getTokens: () => Promise.resolve([...tokens]),
      getAllNfts: () => Promise.resolve([...nfts]),
    }),
  restoreDerivedAccounts: () =>
    Promise.resolve([
      {
        index: 0,
        mnemonic:
          'dilemma usage defy sad adapt balcony olive obey glare pole push surprise risk useful calm ketchup mouse side bulb race hole excess finger address',
        path: "m/44'/501'/0'/0",
        getReceiveAddress: () => '0PeXCQsXyomDckpX2eeBfSLQfNQa3kW3NKttXFN6QLPU',
      },
      {
        index: 1,
        mnemonic:
          'dilemma usage defy sad adapt balcony olive obey glare pole push surprise risk useful calm ketchup mouse side bulb race hole excess finger address',
        path: "m/44'/501'/0'/1",
        getReceiveAddress: () => '1PeXCQsXyomDckpX2eeBfSLQfNQa3kW3NKttXFN6QLPU',
      },
      {
        index: 2,
        mnemonic:
          'dilemma usage defy sad adapt balcony olive obey glare pole push surprise risk useful calm ketchup mouse side bulb race hole excess finger address',
        path: "m/44'/501'/0'/2",
        getReceiveAddress: () => '2PeXCQsXyomDckpX2eeBfSLQfNQa3kW3NKttXFN6QLPU',
      },
    ]),
};
