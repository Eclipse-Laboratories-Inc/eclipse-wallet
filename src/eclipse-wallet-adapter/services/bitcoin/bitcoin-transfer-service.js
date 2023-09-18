const bitcore = require('bitcore-lib');
const http = require('axios');
const transactionService = require('./bitcoin-transaction-service');
const { SALMON_API_URL } = require('../../constants/environment');

const createTransferTransaction = async (network, keyPair, receiverAddress, amountToSend) => {
  const privateKey = keyPair.privateKey;
  const sourceAddress = keyPair.publicKey;
  const satoshiToSend = Math.floor(amountToSend * 100000000);
  const { inputs, totalAmountAvailable } = await resolveInputs(sourceAddress, network);
  const outputCount = 2;
  const inputCount = inputs.length;
  const fee = estimateFee(inputCount, outputCount);
  validateBalance(totalAmountAvailable, satoshiToSend, fee);
  const transaction = buildTransaction({
    sourceAddress,
    receiverAddress,
    satoshiToSend,
    inputs,
    fee,
  });
  transaction.sign(privateKey);
  const executableTx = transaction.serialize();
  const txId = transaction.id;
  return { txId, executableTx };
};

const confirmTransferTransaction = async (network, publicKey, signedTransaction) => {
  return transactionService.send(network, publicKey, signedTransaction);
};

const estimateFee = (inputCount, outputCount) => {
  const inputSize = 146;
  const outputSize = 34;
  const extra = 10;
  const transactionSize = inputCount * inputSize + outputCount * outputSize + extra - inputCount;
  //const fee = transactionSize * 20;
  const fee = transactionSize * 2;
  return fee;
};

const validateBalance = (totalAmountAvailable, satoshiToSend, fee) => {
  if (totalAmountAvailable - satoshiToSend - fee < 0) {
    throw new Error('Balance is too low for this transaction');
  }
};

const getUtxos = async (network, address) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/account/${address}/utxo`;

  const params = { pageSize: 100 };

  const { data } = await http.get(url, { params });

  return data.data;
};

const resolveInputs = async (sourceAddress, network) => {
  const utxos = await getUtxos(network, sourceAddress);

  const totalAmountAvailable = utxos.reduce((total, { satoshis }) => total + satoshis, 0);

  return { inputs: utxos, totalAmountAvailable };
};

const buildTransaction = ({ sourceAddress, receiverAddress, satoshiToSend, inputs, fee }) => {
  const transaction = new bitcore.Transaction();
  transaction.from(inputs);
  transaction.to(receiverAddress, satoshiToSend);
  transaction.change(sourceAddress);
  transaction.fee(fee);
  return transaction;
};

module.exports = {
  createTransferTransaction,
  confirmTransferTransaction,
  estimateFee,
};
