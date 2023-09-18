'use strict';

const getDomainName = async (connection, address) => {
  try {
    return await connection.provider.lookupAddress(address);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getAddress = async (connection, domain) => {
  try {
    return await connection.provider.resolveName(domain);
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  getDomainName,
  getAddress,
};
