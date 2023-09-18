'use strict';

const balanceService = require('../bitcoin/bitcoin-balance-service');
const transactionService = require('../bitcoin/bitcoin-transaction-service');
const transferService = require('../bitcoin/bitcoin-transfer-service');

class BitcoinAccount {
  constructor({ network, index, path, keyPair }) {
    this.network = network;
    this.index = index;
    this.path = path;
    this.keyPair = keyPair;
    this.publicKey = this.keyPair.publicKey;
  }

  retrieveSecurePrivateKey() {
    return this.keyPair.privateKey;
  }

  async getDomain() {
    throw 'method_not_supported';
  }

  async getDomainFromPublicKey(publicKey) {
    throw 'method_not_supported';
  }

  async getPublicKeyFromDomain(domain) {
    throw 'method_not_supported';
  }

  async validateDestinationAccount(address) {
    return {
      type: 'SUCCESS',
      code: 'VALID_ACCOUNT',
      addressType: 'PUBLIC_KEY',
    };
  }

  getReceiveAddress() {
    return this.publicKey;
  }

  async createTransferTransaction(destination, token, amount, opts = {}) {
    return transferService.createTransferTransaction(
      this.network,
      this.keyPair,
      destination,
      amount
    );
  }

  async confirmTransferTransaction(hex) {
    return transferService.confirmTransferTransaction(this.network, this.publicKey, hex);
  }

  async estimateTransferFee(destination, token, amount) {
    return transferService.estimateFee(1, 2);
  }

  async getCredit() {
    return balanceService.getCredit(this.network, this.publicKey);
  }

  async getBalance() {
    return balanceService.getBalance(this.network, this.publicKey);
  }

  async getTransaction(id) {
    return transactionService.find(this.network, this.publicKey, id);
  }

  async getRecentTransactions(paging) {
    return transactionService.list(this.network, this.publicKey, paging);
  }

  async getAllNfts() {
    return null;
  }

  async getAvailableTokens() {
    throw 'method_not_supported';
  }

  async getFeaturedTokens() {
    throw 'method_not_supported';
  }

  async getBestSwapQuote(tokenInId, tokenOutId, amount, slippage = 0.5) {
    throw 'method_not_supported';
  }

  async expireSwapQuote(quote) {
    throw 'method_not_supported';
  }

  async createSwapTransaction(quote, tokenInId, tokenOutId, amount) {
    throw 'method_not_supported';
  }
}

module.exports = BitcoinAccount;
