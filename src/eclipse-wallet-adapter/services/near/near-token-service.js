const indexerService = require('./near-indexer-service');

const applyDecimals = (amount, decimals) => {
  return Math.round(parseFloat(amount) * 10 ** decimals);
};

const applyOutDecimals = (amount, decimals) => {
  return parseFloat(amount) / 10 ** decimals;
};

const getTokensByOwner = async (connection, accountId, network) => {
  const contractsNames = await indexerService.listLikelyTokens(network, accountId);

  return Promise.all(
    contractsNames.map(async (contractName) => {
      try {
        const metadata = await connection.viewFunction(contractName, 'ft_metadata');

        const { name, symbol, decimals, icon } = metadata;

        const params = { account_id: accountId };
        const amount = await connection.viewFunction(contractName, 'ft_balance_of', params);

        return {
          mint: contractName,
          owner: accountId,
          amount,
          decimals,
          uiAmount: applyOutDecimals(amount, decimals)?.toFixed(5),
          symbol,
          name,
          logo: icon,
          address: contractName,
        };
      } catch (error) {
        console.log(`Failed to get data for '${contractName}'`, error);
        return null;
      }
    })
  ).then((tokens) => tokens.filter(Boolean));
};

const getOwnTokens = async (connection, network) => {
  const { accountId } = connection;

  return getTokensByOwner(connection, accountId, network);
};

module.exports = { getOwnTokens, applyDecimals, applyOutDecimals };
