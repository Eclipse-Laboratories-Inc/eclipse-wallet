'use strict';

const { Wallet } = require('ethers');
const EthereumAccount = require('../services/ethereum/EthereumAccount');
const { ETH } = require('../constants/coin-types');

const create = async ({ network, mnemonic, index = 0 }) => {
  const path = `m/44'/${ETH}'/0'/0/${index}`;
  const wallet = Wallet.fromMnemonic(mnemonic, path);
  return new EthereumAccount({ network, index, path, wallet });
};

module.exports = { create };
