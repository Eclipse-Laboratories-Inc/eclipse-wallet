'use strict';

const { connect, keyStores } = require('near-api-js');
const tokenService = require('./near-token-service');
const tokenListService = require('./near-token-list-service');
const balanceService = require('./near-balance-service');
const transferService = require('./near-transfer-service');
const wrapService = require('./near-wrap-service');
const swapService = require('./near-swap-service');
const nftService = require('./near-nft-service');
const validationService = require('./near-validation-service');
const transactionService = require('./near-transaction-service');

class NearAccount {
  constructor({ network, index, path, keyPair, accountId }) {
    this.network = network;
    this.index = index;
    this.path = path;
    this.keyPair = keyPair;
    this.publicKey = this.keyPair.publicKey;
    this.accountId = accountId || Buffer.from(this.publicKey.data).toString('hex');
    this.keyStore = new keyStores.InMemoryKeyStore();
  }

  retrieveSecurePrivateKey() {
    return this.keyPair.secretKey;
  }

  async getConnection() {
    if (!this.connection) {
      await this.keyStore.setKey(this.network.environment, this.accountId, this.keyPair);

      const { nodeUrl, helperUrl } = this.network.config;
      const config = {
        networkId: this.network.environment,
        nodeUrl,
        helperUrl,
        keyStore: this.keyStore,
      };
      const near = await connect(config);
      this.connection = await near.account(this.accountId);
    }
    return this.connection;
  }

  async getCredit() {
    const connection = await this.getConnection();
    const { total } = await connection.getAccountBalance();
    return total;
  }

  async getTokens() {
    const connection = await this.getConnection();
    return tokenService.getOwnTokens(connection, this.network);
  }

  async getBalance() {
    const connection = await this.getConnection();
    return balanceService.getBalance(connection, this.network);
  }

  getReceiveAddress() {
    return this.accountId;
  }

  async validateDestinationAccount(accountId) {
    const connection = await this.getConnection();
    return validationService.validateDestinationAccount(connection, accountId);
  }

  async estimateTransferFee() {
    const connection = await this.getConnection();
    return transferService.estimateFee(connection);
  }

  async createTransferTransaction(destination, token, amount, opts = {}) {
    const connection = await this.getConnection();
    return transferService.createTransaction(connection, token, amount, destination, opts);
  }

  async confirmTransferTransaction(hashId) {
    const connection = await this.getConnection();
    return transferService.confirmTransaction(connection, hashId, this.accountId);
  }

  async getAllNfts() {
    return nftService.getAll(this.network, this.accountId);
  }

  async getNft(contract, mint) {
    return nftService.getNftByAddress(this.network, contract, mint);
  }

  async getAllNftsGrouped() {
    return nftService.getAllGroupedByCollection(this.network, this.accountId);
  }

  async wrapNear(amount) {
    const connection = await this.getConnection();
    return wrapService.wrapNear(connection, this.network, amount);
  }

  async unwrapNear(amount) {
    const connection = await this.getConnection();
    return wrapService.unwrapNear(connection, this.network, amount);
  }

  async getBestSwapQuote(tokenInId, tokenOutId, amount, slippage = 0.5) {
    const connection = await this.getConnection();
    return swapService.quote(connection, this.network, tokenInId, tokenOutId, amount, slippage);
  }

  async expireSwapQuote(quote) {}

  async createSwapTransaction(quote) {
    const connection = await this.getConnection();
    return swapService.swap(connection, this.network, this.accountId, quote);
  }

  async getTransaction(id) {
    return transactionService.find(this.network, this.accountId, id);
  }

  async getRecentTransactions(paging) {
    return transactionService.list(this.network, this.accountId, paging);
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

  async scanTransactions(transactions, options) {
    throw 'method_not_supported';
  }

  async getAvailableTokens() {
    return tokenListService.getTokenList(this.network);
  }

  async getFeaturedTokens() {
    return tokenListService.getFeaturedTokenList(this.network);
  }
}

module.exports = NearAccount;
