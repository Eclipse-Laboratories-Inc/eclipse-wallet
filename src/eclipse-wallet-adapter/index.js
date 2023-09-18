'use strict';

const AccountFactory = require('./factories/account-factory');
const NetworkAccountFactory = require('./factories/network-account-factory');
const { getNetwork, getNetworks } = require('./services/network-service');
const { getSwitches } = require('./services/switch-service');
const { getPathIndex } = require('./services/account-service');
const { getAvatar } = require('./services/avatar-service');
const { generateMnemonic } = require('./services/seed-service');
const { getMetadata } = require('./services/dapp-service');
const { getTopTokensByPlatform } = require('./services/price-service');
const { parseAmount, formatAmount } = require('./services/format');
const {
  getBridgeSupportedTokens,
  getBridgeAvailableTokens,
  getBridgeFeaturedTokens,
  getBridgeEstimatedAmount,
  getBridgeMinimalAmount,
  createBridgeExchange,
  getBridgeTransaction,
} = require('./services/bridge-service');
const BLOCKCHAINS = require('./constants/blockchains');
const PLATFORMS = require('./constants/platforms');

module.exports = {
  AccountFactory,
  NetworkAccountFactory,
  getNetwork,
  getNetworks,
  getSwitches,
  getPathIndex,
  getAvatar,
  generateMnemonic,
  getMetadata,
  getTopTokensByPlatform,
  parseAmount,
  formatAmount,
  getBridgeSupportedTokens,
  getBridgeAvailableTokens,
  getBridgeFeaturedTokens,
  getBridgeEstimatedAmount,
  getBridgeMinimalAmount,
  createBridgeExchange,
  getBridgeTransaction,
  BLOCKCHAINS,
  PLATFORMS,
};
