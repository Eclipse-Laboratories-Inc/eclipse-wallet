const { create } = require('../../factories/solana-account-factory');
const { MNEMONIC, NETWORK_DEVNET } = require('./config');
const { USDC_ADDRESS, SOL_ADDRESS } = require('../../constants/token-constants');

test.skip('solana-swap-quote', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const amount = 100;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(USDC_ADDRESS, SOL_ADDRESS, amount, slippage);
  //console.log(quote);
});

test.skip('solana-create-swap', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const amount = 0.009;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(SOL_ADDRESS, USDC_ADDRESS, amount, slippage);
  //console.log(quote);
  const txId = await account.createSwapTransaction(quote);
  //console.log(txId);
});

test.skip('solana-execute-swap', async () => {
  const account = await create({ network: NETWORK_DEVNET, mnemonic: MNEMONIC });
  const amount = 0.01;
  const slippage = 0.5;
  const quote = await account.getBestSwapQuote(SOL_ADDRESS, USDC_ADDRESS, amount, slippage);
  //console.log(quote);
  const txId = await account.createSwapTransaction(quote);
  //console.log(txId);
  // const result = await account.executeSwapTransaction(txId);
  // console.log(result);
});
