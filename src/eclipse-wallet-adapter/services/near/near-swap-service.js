const {
  transactions: { functionCall },
  utils: {
    format: { parseNearAmount, formatNearAmount },
    web: { fetchJson },
  },
} = require('near-api-js');
const { applyDecimals } = require('./near-token-service');
const { wrapNear, unwrapNear } = require('./near-wrap-service');

const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

const getStorageBalance = async (connection, contractName, accountId) => {
  const args = { account_id: accountId || connection.accountId };
  return connection.viewFunction(contractName, 'storage_balance_of', args);
};

const transferStorageDeposit = async (connection, contractName, receiverId, amount) => {
  return connection.signAndSendTransaction({
    receiverId: contractName,
    actions: [
      functionCall(
        'storage_deposit',
        { account_id: receiverId, registration_only: true },
        FT_STORAGE_DEPOSIT_GAS,
        amount
      ),
    ],
  });
};

const mapSymbol = (id, { symbol }) => (id === 'near' ? 'NEAR' : symbol);

const mapToken = (amount, token, tokenId, network) => {
  if (tokenId === 'near') {
    const { currency, icon } = network;

    return {
      contract: tokenId,
      amount,
      name: 'Near',
      logo: icon,
      ...currency,
    };
  }

  return {
    contract: tokenId,
    amount,
    decimals: token?.decimals,
    symbol: token?.symbol,
    name: token?.name,
    logo: token?.icon,
  };
};

const getToken = async (connection, network, tokenId) => {
  const id = tokenId === 'near' ? network.config.nearTokenId : tokenId;
  const token = await connection.viewFunction(id, 'ft_metadata');
  return { id, ...token };
};

const parseAmount = (network, token, amount) => {
  if (token.id === network.config.nearTokenId) {
    return parseNearAmount(`${amount}`);
  }
  return `${applyDecimals(amount, token.decimals)}`;
};

const quote = async (connection, network, tokenInId, tokenOutId, amount) => {
  const { refFinance, nearTokenId } = network.config;

  const tokenIn = await getToken(connection, network, tokenInId);
  const tokenOut = await getToken(connection, network, tokenOutId);

  const amountIn = parseAmount(network, tokenIn, amount);

  if (tokenIn.id === nearTokenId && tokenOut.id === nearTokenId) {
    return {
      routeNames: [],
      routeSymbols: [mapSymbol(tokenInId, tokenIn), mapSymbol(tokenOutId, tokenOut)],
      input: mapToken(amountIn, tokenIn, tokenInId, network),
      output: mapToken(amountIn, tokenOut, tokenOutId, network),
      custom: { tokenInId, tokenIn, tokenOutId, tokenOut, amount, amountIn },
    };
  }

  const poolsUrl = `${refFinance.apiUrl}/list-pools-by-tokens?token0=${tokenIn.id}&token1=${tokenOut.id}`;
  const pools = await fetchJson(poolsUrl);

  const pool = pools
    .filter(({ amounts }) => Number(amounts[0]) > 0 && Number(amounts[1]) > 0)
    .reduce((prev, current) => (prev.amounts[1] > current.amounts[1] ? prev : current));

  const amountOut = await connection.viewFunction(refFinance.contractId, 'get_return', {
    pool_id: Number(pool.id),
    token_in: tokenIn.id,
    amount_in: amountIn,
    token_out: tokenOut.id,
  });

  return {
    routeNames: [],
    routeSymbols: [tokenIn?.symbol, tokenOut?.symbol],
    fee: pool?.total_fee ? { percent: pool.total_fee / 100 } : undefined,
    input: mapToken(amountIn, tokenIn, tokenInId, network),
    output: mapToken(amountOut, tokenOut, tokenOutId, network),
    custom: { pool, tokenInId, tokenIn, tokenOutId, tokenOut, amount, amountIn, amountOut },
  };
};

const swap = async (connection, network, accountId, quote) => {
  const { pool, tokenInId, tokenIn, tokenOutId, tokenOut, amount, amountIn, amountOut } =
    quote.custom;

  const { refFinance, nearTokenId } = network.config;

  if (tokenInId === nearTokenId && tokenOutId === 'near') {
    const { transaction } = await unwrapNear(connection, network, amount);
    return [{ id: transaction.hash, status: 1 }];
  } else if (tokenInId === 'near' && tokenOutId === nearTokenId) {
    const { transaction } = await wrapNear(connection, network, amount);
    return [{ id: transaction.hash, status: 1 }];
  }

  if (tokenInId === 'near') {
    await wrapNear(connection, network, amount);
  }

  await transferStorageDeposit(
    connection,
    refFinance.contractId,
    accountId,
    FT_MINIMUM_STORAGE_BALANCE
  );

  const storageBalance = await getStorageBalance(connection, tokenOut.id, accountId);

  if (storageBalance?.total === undefined) {
    try {
      await transferStorageDeposit(connection, tokenOut.id, accountId, FT_MINIMUM_STORAGE_BALANCE);
    } catch (e) {
      if (e.message === 'attached deposit is less than the mimimum storage balance') {
        await transferStorageDeposit(
          connection,
          tokenOut.id,
          accountId,
          FT_MINIMUM_STORAGE_BALANCE_LARGE
        );
      }
    }
  }

  const swapActions = [
    {
      pool_id: Number(pool.id),
      token_in: tokenIn.id,
      token_out: tokenOut.id,
      amount_in: amountIn,
      min_amount_out: `${amountOut}`,
    },
  ];

  const { transaction, status } = await connection.functionCall({
    contractId: tokenIn.id,
    methodName: 'ft_transfer_call',
    args: {
      receiver_id: refFinance.contractId,
      amount: amountIn,
      msg: JSON.stringify({ force: 0, actions: swapActions }),
    },
    gas: 300000000000000,
    attachedDeposit: 1,
  });
  const buff = Buffer.from(status.SuccessValue, 'base64');
  const txStatus = buff.toString('ascii');

  if (tokenOutId === 'near') {
    await unwrapNear(connection, network, formatNearAmount(amountOut));
  }

  if (txStatus === '0') {
    return [{ id: transaction?.hash, status: 2 }];
  } else {
    return [{ id: transaction.hash, status: 1 }];
  }
};

module.exports = { quote, swap };
