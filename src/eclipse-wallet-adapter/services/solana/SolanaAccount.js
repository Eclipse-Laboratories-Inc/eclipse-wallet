'use strict';

const bs58 = require('bs58');
const { Connection, PublicKey } = require('@solana/web3.js');
const nftService = require('./solana-nft-service');
const balanceService = require('./solana-balance-service');
const tokenListService = require('./solana-token-list-service');
const transferService = require('./solana-transfer-service');
const tokenService = require('./solana-token-service');
const scanService = require('./solana-scan-service');
const swapService = require('./solana-swap-service');
const nameService = require('./solana-name-service');
const validationService = require('./solana-validation-service');
const transactionService = require('./solana-transaction-service');

class SolanaAccount {
  constructor({ network, index, path, keyPair }) {
    this.network = network;
    this.index = index;
    this.path = path;
    this.keyPair = keyPair;
    this.publicKey = keyPair.publicKey;
  }

  retrieveSecurePrivateKey() {
    return bs58.encode(this.keyPair.secretKey);
  }

  async getConnection() {
    if (!this.connection) {
      const { nodeUrl } = this.network.config;
      this.connection = new Connection(nodeUrl, 'confirmed');
    }
    return this.connection;
  }

  async getCredit() {
    const connection = await this.getConnection();
    return connection.getBalance(this.publicKey);
  }

  async getTokens() {
    const connection = await this.getConnection();
    return tokenListService.getTokensByOwner(connection, this.publicKey);
  }

  async getBalance() {
    const connection = await this.getConnection();
    return balanceService.getBalance(connection, this.publicKey);
  }

  getReceiveAddress() {
    return this.publicKey.toBase58();
  }

  async getOrCreateTokenAccount(toPublicKey, token) {
    const connection = await this.getConnection();
    return tokenService.getOrCreateTokenAccount(connection, this.keyPair, token, toPublicKey);
  }

  async validateDestinationAccount(address) {
    const connection = await this.getConnection();
    return validationService.validateDestinationAccount(connection, address);
  }

  async airdrop(amount) {
    const connection = await this.getConnection();
    return transferService.airdrop(connection, this.publicKey, amount);
  }

  async getAllNfts() {
    return nftService.getAll(this.network, this.publicKey.toBase58());
  }

  async getNft(mint) {
    return nftService.getNftByAddress(this.network, mint);
  }

  async getAllNftsGrouped() {
    return nftService.getAllGroupedByCollection(this.network, this.publicKey.toBase58());
  }

  async getCollectionGroup(filterType) {
    return nftService.getCollectionGroupByFilter(this.network, filterType);
  }

  async getCollection(collectionId) {
    return nftService.getCollectionById(this.network, collectionId);
  }

  async getCollectionItems(collectionId, pageNumber = 1) {
    return nftService.getCollectionItemsById(this.network, collectionId, pageNumber);
  }

  async getListedNfts(ownerAddress) {
    if (ownerAddress) {
      return nftService.getListedByOwner(this.network, ownerAddress);
    }
    return nftService.getListedByOwner(this.network, this.publicKey.toBase58());
  }

  async getNftsBids(ownerAddress) {
    if (ownerAddress) {
      return nftService.getBidsByOwner(this.network, ownerAddress);
    }
    return nftService.getBidsByOwner(this.network, this.publicKey.toBase58());
  }

  async createNftBurnTx(nft) {
    return nftService.createNftBurnTx(this.network, nft.mint, this.publicKey);
  }

  async confirmNftBurn(transaction) {
    const connection = await this.getConnection();
    return nftService.burnNft(connection, transaction, this.keyPair);
  }

  async getBestSwapQuote(inToken, outToken, amount, slippage = 0.5) {
    return swapService.quote(
      this.network,
      inToken,
      outToken,
      this.publicKey.toBase58(),
      amount,
      slippage
    );
  }

  async expireSwapQuote(quote) {}

  async estimateTransactionsFee(messages, commitment = 'confirmed') {
    const connection = await this.getConnection();
    const values = await Promise.all(
      messages.map((message) => connection.getFeeForMessage(message, commitment))
    );
    return values.map(({ value }) => value).reduce((sum, value) => sum + value, 0);
  }

  async estimateTransferFee(destination, token, amount) {
    const connection = await this.getConnection();
    return transferService.estimateFee(
      connection,
      this.keyPair,
      new PublicKey(destination),
      token,
      amount
    );
  }

  async createTransferTransaction(destination, token, amount, opts = {}) {
    const connection = await this.getConnection();
    return transferService.createTransaction(
      connection,
      this.keyPair,
      new PublicKey(destination),
      token,
      amount,
      opts
    );
  }

  async confirmTransferTransaction(txId) {
    const connection = await this.getConnection();
    return transferService.confirmTransaction(connection, txId);
  }

  async createSwapTransaction(quote) {
    swapService.createAssociatedTokenAccount(this.network, quote.custom.id);

    const connection = await this.getConnection();
    const txIds = await swapService.createTransaction(
      this.network,
      connection,
      this.keyPair,
      quote.custom.id
    );

    return txIds;
  }

  async listNft(tokenAddress, price) {
    const connection = await this.getConnection();
    return nftService.listNft(this.network, connection, this.keyPair, tokenAddress, price);
  }

  async unlistNft(tokenAddress) {
    const connection = await this.getConnection();
    return nftService.unlistNft(this.network, connection, this.keyPair, tokenAddress);
  }

  async buyNft(tokenAddress, price, marketplaceId) {
    const connection = await this.getConnection();
    return nftService.buyNft(
      this.network,
      connection,
      this.keyPair,
      tokenAddress,
      price,
      marketplaceId
    );
  }

  async bidNft(tokenAddress, price) {
    const connection = await this.getConnection();
    return nftService.bidNft(this.network, connection, this.keyPair, tokenAddress, price);
  }

  async cancelBidNft(tokenAddress) {
    const connection = await this.getConnection();
    return nftService.cancelBidNft(this.network, connection, this.keyPair, tokenAddress);
  }

  async getTransaction(id) {
    return transactionService.find(this.network, this.publicKey.toBase58(), id);
  }

  async getRecentTransactions(paging) {
    return transactionService.list(this.network, this.publicKey.toBase58(), paging);
  }

  async getDomain() {
    const connection = await this.getConnection();
    return nameService.getDomainName(connection, this.publicKey);
  }

  async getDomainFromPublicKey(publicKey) {
    const connection = await this.getConnection();
    return nameService.getDomainName(connection, publicKey);
  }

  async getPublicKeyFromDomain(domain) {
    const connection = await this.getConnection();
    return nameService.getPublicKey(connection, domain);
  }

  async scanTransactions(transactions, options = {}) {
    return scanService.scanTransactions(
      this.network,
      this.getReceiveAddress(),
      transactions,
      options
    );
  }

  async getAvailableTokens() {
    return tokenListService.getTokenList();
  }

  async getFeaturedTokens() {
    return tokenListService.getFeaturedTokenList();
  }
}

module.exports = SolanaAccount;
