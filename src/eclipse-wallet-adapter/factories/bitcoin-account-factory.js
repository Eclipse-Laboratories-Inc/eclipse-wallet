'use strict';

const bitcoinjs = require('bitcoinjs-lib');
const BitcoinAccount = require('../services/bitcoin/BitcoinAccount');
const { generateChild } = require('../services/seed-service');
const { BTC } = require('../constants/coin-types');

const mapNetwork = (network) => {
  switch (network.environment) {
    case 'testnet':
      return bitcoinjs.networks.testnet;
    case 'regtest':
      return bitcoinjs.networks.regtest;
    case 'mainnet':
    default:
      return bitcoinjs.networks.bitcoin;
  }
};

const create = async ({ network, mnemonic, index = 0 }) => {
  const path = `m/44'/${BTC}'/${index}'/0/0`;

  const child = await generateChild(mnemonic, path);

  const { address: publicKey } = bitcoinjs.payments.p2pkh({
    pubkey: child.publicKey,
    network: mapNetwork(network),
  });
  const privateKey = child.toWIF();
  const keyPair = { publicKey, privateKey };

  return new BitcoinAccount({ network, index, path, keyPair });
};

module.exports = { create };
