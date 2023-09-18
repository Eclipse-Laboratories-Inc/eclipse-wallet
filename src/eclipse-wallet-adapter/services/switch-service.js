'use strict';

const axios = require('axios');
const { SALMON_API_URL } = require('../constants/environment');

let promise;

const getSwitches = async () => {
  if (promise) {
    return promise;
  }

  promise = axios.get(`${SALMON_API_URL}/v1/switches`).then(({ data }) => data);

  try {
    return await promise;
  } catch (error) {
    promise = null;
    throw error;
  }
};

module.exports = { getSwitches };
