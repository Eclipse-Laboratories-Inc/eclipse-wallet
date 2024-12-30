'use strict';

const { v4: uuid } = require('uuid');
const Account = require('../services/Account');
const { createMany: createNetworkAccounts } = require('./network-account-factory');
const { generateMnemonic } = require('../services/seed-service');
const { getNetworks } = require('../services/network-service');
const { getSwitches } = require('../services/switch-service');
const { getRandomAvatar } = require('../services/avatar-service');

const create = async ({
  id = uuid(),
  name = '',
  avatar = getRandomAvatar(),
  mnemonic = generateMnemonic(),
  pathIndexes = {},
}) => {
  const switches = await getSwitches();
  const networks = await getNetworks();

  const networksAccounts = {};

  const enabledNetworks = networks.filter((network) => switches[network.id]?.enable);

  await Promise.all(
    enabledNetworks.map(async (network) => {
      const indexes = pathIndexes[network.id] || [0];
      networksAccounts[network.id] = await createNetworkAccounts([{ network, mnemonic, indexes }]);
      return networksAccounts[network.id];
    })
  );

  return new Account(id, name, avatar, mnemonic, networksAccounts);
};

const createMany = async (accounts) => {
  return Promise.all(accounts.map(create));
};

module.exports = { create, createMany };
