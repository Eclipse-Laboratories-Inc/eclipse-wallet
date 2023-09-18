'use strict';

const axios = require('axios');
const { SALMON_API_URL } = require('../constants/environment');

const getPricesByPlatform = async (platform) => getPrices({ platform });

const getPricesByIds = async (ids) => getPrices({ ids: ids.join(',') });

const getPrices = async (params) => {
  const { data } = await axios.get(`${SALMON_API_URL}/v1/coins`, { params });
  return data;
};

const getTopTokensByPlatform = async (platform) => getTopTokens({ platform });

const getTopTokens = async (params) => {
  const { data } = await axios.get(`${SALMON_API_URL}/v1/top-tokens`, { params });
  return data;
};

module.exports = {
  getPricesByPlatform,
  getPricesByIds,
  getTopTokensByPlatform,
};
