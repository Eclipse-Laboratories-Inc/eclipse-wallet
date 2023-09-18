'use strict';

const { KeyPair } = require('near-api-js');
const { parseSeedPhrase } = require('near-seed-phrase');
const NearAccount = require('../services/near/NearAccount');
const { listAccountsByPublicKey } = require('../services/near/near-indexer-service');

const { NEAR } = require('../constants/coin-types');

const create = async ({ network, mnemonic, index = 0 }) => {
  const path = `m/44'/${NEAR}'/${index}'`;
  const { secretKey, publicKey } = parseSeedPhrase(mnemonic, path);
  const keyPair = KeyPair.fromString(secretKey);
  const accounts = await listAccountsByPublicKey(network, publicKey);
  const accountId = accounts?.[0];
  return new NearAccount({ network, index, path, keyPair, accountId });
};

module.exports = { create };
