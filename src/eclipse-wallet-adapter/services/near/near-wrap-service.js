const {
  transactions: { functionCall },
  utils: {
    format: { parseNearAmount },
  },
} = require('near-api-js');

const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
const FT_TRANSFER_DEPOSIT = '1'; // 1 yocto Near

const wrapNear = async (connection, network, amount) => {
  const actions = [
    functionCall('near_deposit', {}, FT_STORAGE_DEPOSIT_GAS, parseNearAmount(`${amount}`)),
  ];

  const { accountId } = connection;

  const { nearTokenId } = network.config;

  const storage = await connection.viewFunction(nearTokenId, 'storage_balance_of', {
    account_id: accountId,
  });

  if (!storage) {
    actions.unshift(
      functionCall('storage_deposit', {}, FT_STORAGE_DEPOSIT_GAS, FT_MINIMUM_STORAGE_BALANCE)
    );
  }

  return connection.signAndSendTransaction({ receiverId: nearTokenId, actions });
};

const unwrapNear = async (connection, network, amount) => {
  const actions = [
    functionCall(
      'near_withdraw',
      { amount: parseNearAmount(`${amount}`) },
      FT_STORAGE_DEPOSIT_GAS,
      FT_TRANSFER_DEPOSIT
    ),
  ];

  const { accountId } = connection;

  const { nearTokenId } = network.config;

  const storage = await connection.viewFunction(nearTokenId, 'storage_balance_of', {
    account_id: accountId,
  });

  if (!storage) {
    actions.unshift(
      functionCall('storage_deposit', {}, FT_STORAGE_DEPOSIT_GAS, FT_MINIMUM_STORAGE_BALANCE)
    );
  }

  return connection.signAndSendTransaction({ receiverId: nearTokenId, actions });
};

module.exports = { wrapNear, unwrapNear };
