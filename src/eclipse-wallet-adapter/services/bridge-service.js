'use strict';

const axios = require('axios').default;
const { SALMON_API_URL } = require('../constants/environment');

const getBridgeTransaction = async (id) => {
  try {
    const config = {
      params: { id },
    };
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/transaction`, config);
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const createBridgeExchange = async (symbolIn, symbolOut, amount, addressTo) => {
  try {
    const config = {
      params: { symbolIn, symbolOut, amount, addressTo },
    };
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/exchange`, config);
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getBridgeEstimatedAmount = async (symbolIn, symbolOut, amount) => {
  try {
    const config = {
      params: { symbolIn, symbolOut, amount },
    };
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/estimate`, config);
    if (response) {
      return response.data?.estimated_amount;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getBridgeMinimalAmount = async (symbolIn, symbolOut) => {
  try {
    const config = {
      params: { symbolIn, symbolOut },
    };
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/minimal`, config);
    if (response) {
      return response.data?.min_amount;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getBridgeFeaturedTokens = async (symbol) => {
  try {
    const config = { params: { symbol } };
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/featured`, config);
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getBridgeAvailableTokens = async (symbol) => {
  try {
    const config = { params: { symbol } };
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/available`, config);
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getBridgeSupportedTokens = async (network) => {
  try {
    const response = await axios.get(`${SALMON_API_URL}/v1/bridge/supported`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

module.exports = {
  getBridgeSupportedTokens,
  getBridgeAvailableTokens,
  getBridgeFeaturedTokens,
  getBridgeEstimatedAmount,
  getBridgeMinimalAmount,
  createBridgeExchange,
  getBridgeTransaction,
};
