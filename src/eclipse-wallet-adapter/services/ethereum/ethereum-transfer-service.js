const { ethers } = require('ethers');
const { getTokenByAddress } = require('./ethereum-token-list-service');
const { ETH_ADDRESS } = require('../../constants/token-constants');

const ERC20_ABI = require('./erc20.abi.json');
const ERC721_ABI = require('./erc721.abi.json');
const ERC1155_ABI = require('./erc1155.abi.json');
const { parseAmount } = require('../format');

const buildEthTransfer = async (to, amount, decimals) => {
  return { to, value: parseAmount(amount, decimals) };
};

const buildERC20Transfer = async (connection, network, address, amount, opts) => {
  const contract = new ethers.Contract(address, ERC20_ABI, connection);
  const { decimals } = (await getTokenByAddress(network, address))?.[0] || opts || {};
  const value = parseAmount(amount, decimals);
  return { contract, value };
};

const buildERC721Transfer = async (connection, opts) => {
  const contract = new ethers.Contract(opts.contract, ERC721_ABI, connection);
  const from = connection.address;
  return { contract, from };
};

const buildERC1155Transfer = async (connection, opts) => {
  const contract = new ethers.Contract(opts.contract, ERC1155_ABI, connection);
  const from = connection.address;
  const data = [];
  return { contract, from, data };
};

const estimateGas = async (connection, network, to, token, amount, opts) => {
  if (!token || token === ETH_ADDRESS) {
    const tx = await buildEthTransfer(to, amount, network.currency.decimals);
    return connection.provider.estimateGas(tx);
  }
  if (opts.contract) {
    const { standard } = opts;
    if (standard === 'ERC721') {
      const { contract, from } = await buildERC721Transfer(connection, opts);
      return contract.estimateGas['safeTransferFrom(address,address,uint256)'](from, to, token);
    }
    if (standard === 'ERC1155') {
      const { contract, from, data } = await buildERC1155Transfer(connection, opts);
      return contract.estimateGas.safeTransferFrom(from, to, token, amount, data);
    }
  }
  const { contract, value } = await buildERC20Transfer(connection, network, token, amount, opts);
  return contract.estimateGas.transfer(to, value);
};

const estimateFee = async (connection, network, to, token, amount, opts) => {
  const gas = await estimateGas(connection, network, to, token, amount, opts);
  const { maxFeePerGas } = await connection.provider.getFeeData();
  return maxFeePerGas.mul(gas);
};

const createTransaction = async (connection, network, to, token, amount, opts) => {
  if (!token || token === ETH_ADDRESS) {
    const tx = await buildEthTransfer(to, amount, network.currency.decimals);
    const { hash } = await connection.sendTransaction(tx);
    return { txId: hash };
  }

  if (opts.contract) {
    const { standard } = opts;
    if (standard === 'ERC721') {
      const { contract, from } = await buildERC721Transfer(connection, opts);
      const { hash } = await contract['safeTransferFrom(address,address,uint256)'](from, to, token);
      return { txId: hash };
    }
    if (standard === 'ERC1155') {
      const { contract, from, data } = await buildERC1155Transfer(connection, opts);
      const { hash } = await contract.safeTransferFrom(from, to, token, amount, data);
      return { txId: hash };
    }
  }

  const { contract, value } = await buildERC20Transfer(connection, network, token, amount, opts);
  const { hash } = await contract.transfer(to, value);
  return { txId: hash };
};

const confirmTransaction = async (connection, hash) => {
  return await connection.provider.waitForTransaction(hash);
};

module.exports = {
  estimateFee,
  createTransaction,
  confirmTransaction,
};
