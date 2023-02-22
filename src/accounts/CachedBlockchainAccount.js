'use strict';

const { cache, CACHE_TYPES } = require('../utils/cache');

class CachedBlockchainAccount {
  constructor(base) {
    this.base = base;
    this.network = base.network;
    this.index = base.index;
    this.path = base.path;
    this.keyPair = base.keyPair;
    this.publicKey = base.publicKey;
  }

  baseKey() {
    return `${this.network.id}-${this.base.getReceiveAddress()}`;
  }

  retrieveSecurePrivateKey() {
    return this.base.retrieveSecurePrivateKey();
  }

  async getConnection() {
    return this.base.getConnection();
  }

  async getCredit() {
    return this.base.getCredit();
  }

  async getTokens() {
    return this.base.getTokens();
  }

  async getBalance(...args) {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.BALANCE, () => this.base.getBalance(...args));
  }

  getReceiveAddress(...args) {
    return this.base.getReceiveAddress(...args);
  }

  async getOrCreateTokenAccount(...args) {
    return this.base.getOrCreateTokenAccount(...args);
  }

  async validateDestinationAccount(...args) {
    return this.base.validateDestinationAccount(...args);
  }

  async airdrop(...args) {
    return this.base.airdrop(...args);
  }

  async getAllNfts() {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.NFTS_ALL, () => this.base.getAllNfts());
  }

  async getNft(...args) {
    const key = `${this.baseKey()}-${args.join('-')}`;
    return cache(key, CACHE_TYPES.SINGLE_NFT, () => this.base.getNft(...args));
  }

  async getAllNftsGrouped() {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.NFTS, () => this.base.getAllNftsGrouped());
  }

  async getCollectionGroup(...args) {
    return this.base.getCollectionGroup(...args);
  }

  async getCollection(...args) {
    return this.base.getCollection(...args);
  }

  async getCollectionItems(...args) {
    return this.base.getCollectionItems(...args);
  }

  async getListedNfts(...args) {
    return this.base.getListedNfts(...args);
  }

  async getNftsBids(...args) {
    return this.base.getNftsBids(...args);
  }

  async createNftBurnTx(...args) {
    return this.base.createNftBurnTx(...args);
  }

  async confirmNftBurn(...args) {
    return this.base.confirmNftBurn(...args);
  }

  async getBestSwapQuote(...args) {
    return this.base.getBestSwapQuote(...args);
  }

  async estimateTransactionsFee(...args) {
    return this.base.estimateTransactionsFee(...args);
  }

  async estimateTransferFee(...args) {
    return this.base.estimateTransferFee(...args);
  }

  async createTransferTransaction(...args) {
    return this.base.createTransferTransaction(...args);
  }

  async confirmTransferTransaction(...args) {
    return this.base.confirmTransferTransaction(...args);
  }

  async createSwapTransaction(...args) {
    return this.base.createSwapTransaction(...args);
  }

  async listNft(...args) {
    return this.base.listNft(...args);
  }

  async unlistNft(...args) {
    return this.base.unlistNft(...args);
  }

  async buyNft(...args) {
    return this.base.buyNft(...args);
  }

  async bidNft(...args) {
    return this.base.bidNft(...args);
  }

  async cancelBidNft(...args) {
    return this.base.cancelBidNft(...args);
  }

  async getTransaction(...args) {
    return this.base.getTransaction(...args);
  }

  async getRecentTransactions(...args) {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.TRANSACTIONS, () =>
      this.base.getRecentTransactions(...args),
    );
  }

  async getDomain() {
    return this.base.getDomain();
  }

  async getDomainFromPublicKey(...args) {
    return this.base.getDomainFromPublicKey(...args);
  }

  async getPublicKeyFromDomain(...args) {
    return this.base.getPublicKeyFromDomain(...args);
  }

  async scanTransactions(...args) {
    return this.base.scanTransactions(...args);
  }

  async getAvailableTokens() {
    const key = this.network.id;
    return cache(key, CACHE_TYPES.AVAILABLE_TOKENS, () =>
      this.base.getAvailableTokens(),
    );
  }

  async getFeaturedTokens() {
    const key = this.network.id;
    return cache(key, CACHE_TYPES.FEATURED_TOKENS, () =>
      this.base.getFeaturedTokens(),
    );
  }
}

module.exports = CachedBlockchainAccount;
