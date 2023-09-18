'use strict';

const http = require('axios');
const { SALMON_API_URL } = require('../../constants/environment');

const scanTransactions = async (network, userAccount, txObject, { origin, language }) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/scan/transactions`;

  const config = {
    params: Object.assign({}, language && { language }),
  };

  const payload = {
    txObject,
    userAccount,
    metadata: Object.assign({}, origin && { origin }),
  };

  const { data } = await http.post(url, payload, config);

  return data;
};

module.exports = { scanTransactions };
