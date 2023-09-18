const { PublicKey } = require('@solana/web3.js');
const nameService = require('./solana-name-service');

const INVALID_ADDRESS = {
  type: 'ERROR',
  code: 'INVALID_ADDRESS',
};
const EMPTY_ACCOUNT = {
  type: 'WARNING',
  code: 'EMPTY_ACCOUNT',
};
const NO_FUNDS = {
  type: 'WARNING',
  code: 'NO_FUNDS',
};

const VALID_ACCOUNT = {
  type: 'SUCCESS',
  code: 'VALID_ACCOUNT',
  addressType: 'PUBLIC_KEY',
};

const VALID_DOMAIN = {
  type: 'SUCCESS',
  code: 'VALID_ACCOUNT',
  addressType: 'DOMAIN',
};

const validateDestinationAccount = async (connection, address) => {
  const result = isPublicKey(address)
    ? validatePublicKey(connection, address)
    : validateDomain(connection, address);
  return result;
};

const validatePublicKey = async (connection, address) => {
  let publicKey = null;
  try {
    publicKey = new PublicKey(address);
  } catch {
    return INVALID_ADDRESS;
  }

  const isValidAddress = PublicKey.isOnCurve(publicKey);
  if (!isValidAddress) return INVALID_ADDRESS;

  const accountInfo = await connection.getAccountInfo(publicKey);
  if (accountInfo == null) return EMPTY_ACCOUNT;
  if (accountInfo.lamports == 0) return NO_FUNDS;
  return VALID_ACCOUNT;
};

const isPublicKey = (address) => {
  try {
    publicKey = new PublicKey(address);
  } catch {
    return false;
  }
  return true;
};

const validateDomain = async (connection, address) => {
  try {
    const pk = await nameService.getPublicKey(connection, address);
    return pk ? VALID_DOMAIN : INVALID_ADDRESS;
  } catch (e) {
    console.log(e);
    return INVALID_ADDRESS;
  }
};

module.exports = {
  validateDestinationAccount,
};
