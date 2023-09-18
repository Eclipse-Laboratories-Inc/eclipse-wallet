'use strict';

const { ethers } = require('ethers');
const {
  ETH,
  TradeDirection,
  UniswapPair,
  UniswapPairSettings,
  UniswapVersion,
  TokensFactoryPublic,
  removeEthFromContractAddress,
} = require('simple-uniswap-sdk');
const { ETH_ADDRESS } = require('../../constants/token-constants');
const { parseAmount } = require('../format');

const WETH9_ABI = require('./weth9.abi.json');

const mapToken = (amount, token) => ({
  contract: token?.contractAddress,
  decimals: token?.decimals,
  symbol: token.symbol,
  name: token.name,
  amount: parseAmount(amount, token?.decimals),
});

const calculateFee = (trade) => {
  const { uniswapVersion, liquidityProviderFeePercent, liquidityProviderFeePercentsV3 } = trade;

  if (uniswapVersion === UniswapVersion.v3) {
    return {
      percent:
        liquidityProviderFeePercentsV3.reduce((value, fee) => value + fee - value * fee, 0) * 100,
    };
  }

  return { percent: liquidityProviderFeePercent * 100 };
};

const getContractAddress = (chainId, contractAddress) => {
  if (contractAddress === 'eth') {
    return ETH.info(chainId).contractAddress;
  } else {
    return contractAddress;
  }
};

const quote = async (connection, inToken, outToken, amount, slippage) => {
  const { chainId } = connection.provider.network;

  const wEthAddress = removeEthFromContractAddress(ETH.info(chainId).contractAddress);

  if (inToken === ETH_ADDRESS && outToken === wEthAddress) {
    const tokensFactory = new TokensFactoryPublic({ ethereumProvider: connection.provider });
    const [wEthToken] = await tokensFactory.getTokens([wEthAddress]);
    const ethToken = ETH.info(chainId);

    const transaction = {
      to: wEthAddress,
      value: parseAmount(amount, ethToken.decimals),
    };

    const gas = await connection.provider.estimateGas(transaction);

    const { maxFeePerGas } = await connection.provider.getFeeData();

    const fee = {
      amount: maxFeePerGas.mul(gas),
      symbol: ethToken.symbol,
      decimals: ethToken.decimals,
    };

    return {
      routeNames: [],
      routeSymbols: [ethToken.symbol, wEthToken.symbol],
      fee,
      input: mapToken(amount, ethToken),
      output: mapToken(amount, wEthToken),
      custom: {
        transaction,
        destroy: () => {},
      },
    };
  }

  if (inToken === wEthAddress && outToken === ETH_ADDRESS) {
    const tokensFactory = new TokensFactoryPublic({ ethereumProvider: connection.provider });
    const [wEthToken] = await tokensFactory.getTokens([wEthAddress]);
    const ethToken = ETH.info(chainId);

    const contract = new ethers.Contract(wEthAddress, WETH9_ABI, connection);

    const value = parseAmount(amount, wEthToken.decimals);

    const approvalTransaction = await contract.populateTransaction.approve(wEthAddress, value);

    const transaction = await contract.populateTransaction.withdraw(value);

    const gas =
      (await connection.provider.estimateGas(approvalTransaction)) +
      (await connection.provider.estimateGas(transaction));

    const { maxFeePerGas } = await connection.provider.getFeeData();

    const fee = {
      amount: maxFeePerGas.mul(gas),
      symbol: ethToken.symbol,
      decimals: ethToken.decimals,
    };

    return {
      routeNames: [],
      routeSymbols: [wEthToken.symbol, ethToken.symbol],
      fee,
      input: mapToken(amount, wEthToken),
      output: mapToken(amount, ethToken),
      custom: {
        approvalTransaction,
        transaction,
        destroy: () => {},
      },
    };
  }

  const uniswapPair = new UniswapPair({
    // the contract address of the token you want to convert FROM
    fromTokenContractAddress: getContractAddress(chainId, inToken),
    // the contract address of the token you want to convert TO
    toTokenContractAddress: getContractAddress(chainId, outToken),
    // the ethereum address of the user using this part of the wallet
    ethereumAddress: connection.address,
    chainId, // ethereumProvider: connection.provider,
    settings: new UniswapPairSettings({
      // if not supplied it will use `0.0005` which is 0.5%
      // please pass it in as a full number decimal so 0.7%
      // would be 0.007
      slippage: slippage ? slippage / 100 : undefined,
      // if not supplied it will use 20 a deadline minutes
      deadlineMinutes: 20,
      // if not supplied it will try to use multihops
      // if this is true it will require swaps to direct
      // pairs
      disableMultihops: false,
      // for example if you only wanted to turn on quotes for v3 and not v3
      // you can only support the v3 enum same works if you only want v2 quotes
      // if you do not supply anything it query both v2 and v3
      uniswapVersions: [UniswapVersion.v2, UniswapVersion.v3],
    }),
  });

  const uniswapPairFactory = await uniswapPair.createFactory();

  const trade = await uniswapPairFactory.trade(`${amount}`, TradeDirection.input);

  if (!trade.fromBalance.hasEnough) {
    throw new Error('You do not have enough from balance to execute this swap');
  }

  return {
    routeNames: ['Uniswap'],
    routeSymbols: trade.routeText?.split(' > '),
    fee: calculateFee(trade),
    input: mapToken(amount, trade.fromToken),
    output: mapToken(trade.expectedConvertQuote, trade.toToken),
    custom: trade,
  };
};

const expire = async (quote) => {
  const trade = quote.custom;
  trade.destroy();
};

const execute = async (connection, quote) => {
  const trade = quote.custom;

  if (trade.approvalTransaction) {
    const approved = await connection.sendTransaction(trade.approvalTransaction);
    await approved.wait();
  }

  const tradeTransaction = await connection.sendTransaction(trade.transaction);
  const receipt = await tradeTransaction.wait();

  // once done with trade aka they have sent it and you don't need it anymore call
  trade.destroy();

  return [{ id: receipt.transactionHash, status: receipt.status }];
};

module.exports = { quote, expire, execute };
