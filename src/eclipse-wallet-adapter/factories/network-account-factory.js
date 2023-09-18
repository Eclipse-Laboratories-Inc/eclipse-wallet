'use strict';

const { create: createBitcoin } = require('./bitcoin-account-factory');
const { create: createEthereum } = require('./ethereum-account-factory');
const { create: createNear } = require('./near-account-factory');
const { create: createSolana } = require('./solana-account-factory');
const { BITCOIN, ETHEREUM, NEAR, SOLANA } = require('../constants/blockchains');

const create = async ({ network, mnemonic, index = 0 }) => {
  switch (network.blockchain) {
    case BITCOIN:
      return createBitcoin({ network, mnemonic, index });
    case ETHEREUM:
      return createEthereum({ network, mnemonic, index });
    case NEAR:
      return createNear({ network, mnemonic, index });
    case SOLANA:
      return createSolana({ network, mnemonic, index });
    default:
      return null;
  }
};

const createMany = async ({ network, mnemonic, indexes }) => {
  const accounts = await Promise.all(
    indexes.map(async (index) => create({ network, mnemonic, index }))
  );

  return accounts.reduce((result, account) => {
    if (account) {
      result[account.index] = account;
    }
    return result;
  }, []);
};

module.exports = { create, createMany };
