const { getTokenList } = require('../../services/solana/solana-token-list-service');

test('solana-token-list-service', async () => {
  const tokenList = await getTokenList();
  expect(tokenList).toBeDefined();
});
