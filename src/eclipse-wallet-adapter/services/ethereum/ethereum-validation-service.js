'use strict';

const { isAddress } = require('ethers/lib/utils');

const INVALID_ADDRESS = {
  type: 'ERROR',
  code: 'INVALID_ADDRESS',
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

const validateAddress = async (provider, address) => {
  const balance = await provider.getBalance(address);
  if (balance == 0) {
    return NO_FUNDS;
  }
  return VALID_ACCOUNT;
};

const validateDomain = async (provider, domain) => {
  try {
    const address = await provider.resolveName(domain);
    if (address) {
      return VALID_DOMAIN;
    }
  } catch (e) {
    console.log(e);
  }
  return INVALID_ADDRESS;
};

const validateDestinationAccount = async (connection, address) => {
  const { provider } = connection;
  if (isAddress(address)) {
    return validateAddress(provider, address);
  } else {
    return validateDomain(provider, address);
  }
};

module.exports = { validateDestinationAccount };
