const {
  transactions: { functionCall },
  utils: {
    format: { parseNearAmount },
  },
} = require('near-api-js');
const { applyDecimals } = require('./near-token-service');

const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');
const FT_TRANSFER_DEPOSIT = '1'; // 1 yocto Near

const NFT_TRANSFER_GAS = parseNearAmount('0.00000000003');
const NFT_TRANSFER_DEPOSIT = '1'; // 1 yocto Near

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

const createTransaction = async (connection, token, amount, destination, opts = {}) => {
  const { contract } = opts;
  if (contract) {
    const { transaction } = await transferNft(connection, contract, token, destination);
    return { txId: transaction.hash };
  }
  if (token === null || token === 'near') {
    const { transaction } = await transferNear(connection, amount, destination);
    return { txId: transaction.hash };
  } else {
    return await transferToken(connection, token, amount, destination, opts);
  }
};

const transferNear = async (connection, amount, receiverId) => {
  return connection.sendMoney(receiverId, parseNearAmount(`${amount}`));
};

const transferToken = async (connection, contractName, amount, receiverId, opts) => {
  const { decimals } = opts;
  const transferAmount = decimals ? applyDecimals(amount, decimals) : amount;
  const storageBalance = await getStorageBalance(connection, contractName, receiverId);

  if (storageBalance?.total === undefined) {
    try {
      await transferStorageDeposit(
        connection,
        contractName,
        receiverId,
        FT_MINIMUM_STORAGE_BALANCE
      );
    } catch (e) {
      if (e.message === 'attached deposit is less than the mimimum storage balance') {
        await transferStorageDeposit(
          connection,
          contractName,
          receiverId,
          FT_MINIMUM_STORAGE_BALANCE_LARGE
        );
      }
    }
  }

  const { transaction } = await connection.signAndSendTransaction({
    receiverId: contractName,
    actions: [
      functionCall(
        'ft_transfer',
        { amount: `${transferAmount.toString()}`, memo: opts?.memo, receiver_id: receiverId },
        FT_TRANSFER_GAS,
        FT_TRANSFER_DEPOSIT
      ),
    ],
  });
  return { txId: transaction.hash };
};

const transferNft = async (connection, contractName, tokenId, receiverId) => {
  return connection.signAndSendTransaction({
    receiverId: contractName,
    actions: [
      functionCall(
        'nft_transfer',
        {
          receiver_id: receiverId,
          token_id: tokenId,
        },
        NFT_TRANSFER_GAS,
        NFT_TRANSFER_DEPOSIT
      ),
    ],
  });
};

const estimateFee = async (connection) => {
  const { gas_price } = await connection.connection.provider.gasPrice(null);
  return gas_price;
};

const confirmTransaction = async (connection, hashId, accountId) => {
  return await connection.connection.provider.txStatus(hashId, accountId);
};

module.exports = { createTransaction, transferNft, confirmTransaction, estimateFee };
