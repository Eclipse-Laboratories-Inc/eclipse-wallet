'use strict';

const balanceService = require('./ethereum-balance-service');
const nameService = require('./ethereum-name-service');
const nftService = require('./ethereum-nft-service');
const scanService = require('./ethereum-scan-service');
const swapService = require('./ethereum-swap-service');
const tokenListService = require('./ethereum-token-list-service');
const transactionService = require('./ethereum-transaction-service');
const transferService = require('./ethereum-transfer-service');
const validationService = require('./ethereum-validation-service');
const EthereumSalmonProvider = require('./ethereum-salmon-provider');

class EthereumAccount {
  constructor({ network, index, path, wallet }) {
    this.network = network;
    this.index = index;
    this.path = path;
    this.wallet = wallet;
    this.keyPair = this.wallet._signingKey();
    this.publicKey = this.keyPair.publicKey;
  }

  retrieveSecurePrivateKey() {
    return this.keyPair.privateKey;
  }

  async getConnection() {
    if (!this.connection) {
      this.connection = this.wallet.connect(new EthereumSalmonProvider(this.network));
    }
    return this.connection;
  }

  async getCredit() {
    const connection = await this.getConnection();
    return connection.getBalance();
  }

  async getTokens(tokenAddresses) {
    return tokenListService.getTokensByOwner(this.network, this.wallet.address, tokenAddresses);
  }

  async getBalance(tokenAddresses) {
    return balanceService.getBalance(this.network, this.wallet.address, tokenAddresses);
  }

  getReceiveAddress() {
    return this.wallet.address;
  }

  async getOrCreateTokenAccount(toPublicKey, token) {
    throw 'method_not_supported';
  }

  async validateDestinationAccount(address) {
    const connection = await this.getConnection();
    return validationService.validateDestinationAccount(connection, address);
  }

  async airdrop(amount) {
    throw 'method_not_supported';
  }

  async getAllNfts() {
    return nftService.getAll(this.network, this.wallet.address);
  }

  async getNft(contract, tokenId) {
    return nftService.getNftByAddress(this.network, this.wallet.address, contract, tokenId);
  }

  async getAllNftsGrouped() {
    return nftService.getAllGroupedByCollection(this.network, this.wallet.address);
  }

  async getCollectionGroup(filterType) {
    throw 'method_not_supported';
  }

  async getCollection(collectionId) {
    throw 'method_not_supported';
  }

  async getCollectionItems(collectionId, pageNumber) {
    throw 'method_not_supported';
  }

  async getListedNfts(ownerAddress) {
    throw 'method_not_supported';
  }

  async getNftsBids(ownerAddress) {
    throw 'method_not_supported';
  }

  async createNftBurnTx(nft) {
    throw 'method_not_supported';
  }

  async confirmNftBurn(transaction) {
    throw 'method_not_supported';
  }

  async getBestSwapQuote(inToken, outToken, amount, slippage) {
    const connection = await this.getConnection();
    return swapService.quote(connection, inToken, outToken, amount, slippage);
  }

  async expireSwapQuote(quote) {
    return swapService.expire(quote);
  }

  async createSwapTransaction(quote) {
    const connection = await this.getConnection();
    return swapService.execute(connection, quote);
  }

  async estimateTransactionsFee(messages, commitment = 'confirmed') {
    throw 'method_not_supported';
  }

  async estimateTransferFee(destination, token, amount, opts = {}) {
    const connection = await this.getConnection();
    return await transferService.estimateFee(
      connection,
      this.network,
      destination,
      token,
      amount,
      opts
    );
  }

  async createTransferTransaction(destination, token, amount, opts = {}) {
    const connection = await this.getConnection();
    return await transferService.createTransaction(
      connection,
      this.network,
      destination,
      token,
      amount,
      opts
    );
  }

  async confirmTransferTransaction(txId) {
    const connection = await this.getConnection();
    return await transferService.confirmTransaction(connection, txId);
  }

  async listNft(tokenAddress, price) {
    throw 'method_not_supported';
  }

  async unlistNft(tokenAddress) {
    throw 'method_not_supported';
  }

  async buyNft(tokenAddress, price) {
    throw 'method_not_supported';
  }

  async bidNft(tokenAddress, price) {
    throw 'method_not_supported';
  }

  async cancelBidNft(tokenAddress) {
    throw 'method_not_supported';
  }

  async getTransaction(id) {
    return transactionService.find(this.network, this.wallet.address, id);
  }

  async getRecentTransactions(paging) {
    return transactionService.list(this.network, this.wallet.address, paging);
  }

  async getDomain() {
    const connection = await this.getConnection();
    return nameService.getDomainName(connection, this.wallet.address);
  }

  async getDomainFromPublicKey(address) {
    const connection = await this.getConnection();
    return nameService.getDomainName(connection, address);
  }

  async getPublicKeyFromDomain(domain) {
    const connection = await this.getConnection();
    return nameService.getAddress(connection, domain);
  }

  async scanTransactions(txObject, options = {}) {
    return scanService.scanTransactions(this.network, this.getReceiveAddress(), txObject, options);
  }

  async getAvailableTokens() {
    return tokenListService.getTokenList(this.network);
  }

  async getFeaturedTokens() {
    return tokenListService.getFeaturedTokenList(this.network);
  }
}

module.exports = EthereumAccount;
