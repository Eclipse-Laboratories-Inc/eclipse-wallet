'use strict';

const { UrlJsonRpcProvider } = require('@ethersproject/providers');
const { SALMON_API_URL } = require('../../constants/environment');

const NETWORKS = {};

class EthereumSalmonProvider extends UrlJsonRpcProvider {
  constructor(network) {
    NETWORKS[network.environment] = network;
    super(network.environment);
  }

  isCommunityResource() {
    return true;
  }

  static getUrl(network) {
    const environment = network.name === 'homestead' ? 'mainnet' : network.name;

    const networkId = NETWORKS[environment].id;

    return {
      allowGzip: true,
      url: `${SALMON_API_URL}/v1/${networkId}/rpc`,
    };
  }
}

module.exports = EthereumSalmonProvider;
