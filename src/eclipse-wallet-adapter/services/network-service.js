'use strict';

const axios = require('axios');
const { SALMON_API_URL } = require('../constants/environment');

let promise;

const getNetworks = async () => {
  if (promise) {
    return promise;
  }

  promise = axios.get(`${SALMON_API_URL}/v1/networks`).then(({ data }) => data);

  try {
    return await promise;
  } catch (error) {
    promise = null;
    throw error;
  }
};

const getNetwork = async (id) => {
  const networks = await getNetworks();
  return networks?.find((network) => network.id === id);
};

module.exports = { getNetwork, getNetworks };
