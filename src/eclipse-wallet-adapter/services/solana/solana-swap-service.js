const axios = require('axios').default;
const { Transaction } = require('@solana/web3.js');
const { applyDecimals } = require('./solana-token-service');
const { getTokenList } = require('./solana-token-list-service');
const { SOL_ADDRESS } = require('../../constants/token-constants');
const { SALMON_API_URL } = require('../../constants/environment');

const quote = async (network, inAdress, outAdress, publicKey, amount, slippage) => {
  const tokens = await getTokenList();
  const inValidAddress = inAdress === publicKey ? SOL_ADDRESS : inAdress;
  const outValidAddress = outAdress === publicKey ? SOL_ADDRESS : outAdress;
  const inToken = tokens.find((t) => t.address === inValidAddress);
  const inputAmount = applyDecimals(amount, inToken.decimals);
  const url = `${SALMON_API_URL}/v1/${network.id}/ft/swap/quote`;
  const params = {
    inputMint: inValidAddress,
    outputMint: outValidAddress,
    amount: inputAmount,
    slippage,
  };
  const response = await axios.get(url, { params });
  return response.data;
};

const createTransaction = async (network, connection, keypair, routeId) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/ft/swap/transaction`;
  const params = { id: routeId, publicKey: keypair.publicKey.toBase58() };
  const response = await axios.get(url, {
    params,
  });
  const { setupTransaction, swapTransaction, cleanupTransaction } = response.data;

  const txids = [];
  const transactions = [
    { name: 'setupTransaction', value: setupTransaction },
    { name: 'swapTransaction', value: swapTransaction },
    { name: 'cleanupTransaction', value: cleanupTransaction },
  ].filter(({ value }) => value);

  for (let tx of transactions) {
    // get transaction object from serialized transaction
    const serializedTransaction = tx.value;
    const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

    // perform the swap
    const txid = await connection.sendTransaction(transaction, [keypair], {
      skipPreflight: true,
    });

    const confirmation = await connection.confirmTransaction(txid, 'confirmed');
    const status = confirmation?.value?.err ? 'fail' : 'success';

    txids.push({ id: txid, name: tx.name, status });

    if (status === 'fail') {
      return txids;
    }
  }

  return txids;
};

const createAssociatedTokenAccount = async (network, routeId) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/account/ata`;
  try {
    const { data } = await axios.post(url, { route_id: routeId });

    return data.address;
  } catch (error) {
    console.log(`Cannot create ATA for route id ${routeId}`);
    return null;
  }
};

module.exports = {
  quote,
  createTransaction,
  createAssociatedTokenAccount,
};
