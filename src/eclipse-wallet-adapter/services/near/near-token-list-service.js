const { listTokens } = require('./ref-finance-service');

async function getTokenList(network) {
  const allTokens = await listTokens(network);

  const tokens = allTokens.map((token) => ({
    address: token.id,
    spec: token.spec,
    name: token.name,
    symbol: token.symbol,
    logo:
      token.icon ||
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
    reference_hash: token.reference_hash,
    decimals: token.decimals,
  }));
  const nearToken = [
    {
      address: 'near',
      spec: 'ft-1.0.0',
      name: 'Near',
      symbol: 'NEAR',
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png',
      reference: '',
      reference_hash: '',
      decimals: 18,
    },
  ];
  return nearToken.concat(tokens);
}

async function getFeaturedTokenList(network) {
  const tokens = await getTokenList(network);
  const featuredList = [
    { address: 'near', symbol: 'NEAR' },
    { address: 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near', symbol: 'USDC.e' },
  ];
  return tokens.filter((t) =>
    featuredList.some((el) => el.symbol === t.symbol && el.address === t.address)
  );
}

module.exports = {
  getTokenList,
  getFeaturedTokenList,
};
