'use strict';

const { cache, CACHE_TYPES } = require('../utils/cache');

/**
 * Class representing a cached blockchain account that wraps another base account object.
 * Methods return cached results where applicable to improve performance and reduce redundant calls.
 */
class CachedBlockchainAccount {
  /**
   * Create a cached blockchain account.
   * @param {Object} base - The base account object that provides underlying functionality.
   */
  constructor(base) {
    this.base = base;
    this.network = base.network;
    this.index = base.index;
    this.path = base.path;
    this.keyPair = base.keyPair;
    this.publicKey = base.publicKey;
  }

  /**
   * Generate a unique base key used for caching based on the network and the receive address.
   * @returns {string} - A unique cache key.
   */
  baseKey() {
    return `${this.network.id}-${this.base.getReceiveAddress()}`;
  }

  /**
   * Retrieve a secure private key from the underlying base account.
   * @returns {Promise<string>} - The private key as a secure string.
   */
  retrieveSecurePrivateKey() {
    return this.base.retrieveSecurePrivateKey();
  }

  /**
   * Get a connection instance from the base account.
   * @returns {Promise<*>} - The connection instance.
   */
  async getConnection() {
    return this.base.getConnection();
  }

  /**
   * Get credit information from the base account.
   * @returns {Promise<*>} - The credit info.
   */
  async getCredit() {
    return this.base.getCredit();
  }

  /**
   * Get token balances or token information from the base account.
   * @returns {Promise<Array>} - A list of tokens.
   */
  async getTokens() {
    return this.base.getTokens();
  }

  /**
   * Get the balance of the account. Results are cached for performance.
   * @param {...any} args - Arguments passed through to the base method.
   * @returns {Promise<Number>} - The account balance.
   */
  async getBalance(...args) {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.BALANCE, () => this.base.getBalance(...args));
  }

  /**
   * Get the receive address from the base account.
   * @param {...any} args - Arguments passed through to the base method.
   * @returns {string} - The receive address.
   */
  getReceiveAddress(...args) {
    return this.base.getReceiveAddress(...args);
  }

  /**
   * Get or create a token account using the base account.
   * @param {...any} args - Arguments passed through to the base method.
   * @returns {Promise<*>} - The token account details.
   */
  async getOrCreateTokenAccount(...args) {
    return this.base.getOrCreateTokenAccount(...args);
  }

  /**
   * Validate destination account details using the base account.
   * @param {...any} args - Arguments passed through to the base method.
   * @returns {Promise<boolean>} - True if valid, otherwise false.
   */
  async validateDestinationAccount(...args) {
    return this.base.validateDestinationAccount(...args);
  }

  /**
   * Airdrop tokens (if supported) using the base account.
   * @param {...any} args - Arguments passed through to the base method.
   * @returns {Promise<*>} - The result of the airdrop.
   */
  async airdrop(...args) {
    return this.base.airdrop(...args);
  }

  /**
   * Get all NFTs associated with the account. Results are cached.
   * @returns {Promise<Array>} - A list of all NFTs.
   */
  async getAllNfts() {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.NFTS_ALL, () => this.base.getAllNfts());
  }

  /**
   * Get a specific NFT by arguments. Results are cached.
   * NOTE: If args are complex, consider using a more robust serialization method (e.g., JSON.stringify).
   * @param {...any} args - Arguments passed to identify the NFT.
   * @returns {Promise<*>} - The requested NFT details.
   */
  async getNft(...args) {
    const key = `${this.baseKey()}-${args.join('-')}`;
    return cache(key, CACHE_TYPES.SINGLE_NFT, () => this.base.getNft(...args));
  }

  /**
   * Get all NFTs grouped by some criterion (e.g., collection). Results are cached.
   * @returns {Promise<*>} - Grouped NFTs.
   */
  async getAllNftsGrouped() {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.NFTS, () => this.base.getAllNftsGrouped());
  }

  /**
   * Get collection group details using the base account.
   * @param {...any} args - Arguments passed to identify the collection group.
   * @returns {Promise<*>} - Collection group details.
   */
  async getCollectionGroup(...args) {
    return this.base.getCollectionGroup(...args);
  }

  /**
   * Get collection details using the base account.
   * @param {...any} args - Arguments passed to identify the collection.
   * @returns {Promise<*>} - Collection details.
   */
  async getCollection(...args) {
    return this.base.getCollection(...args);
  }

  /**
   * Get items in a collection using the base account.
   * @param {...any} args - Arguments passed to identify collection items.
   * @returns {Promise<Array>} - Collection items.
   */
  async getCollectionItems(...args) {
    return this.base.getCollectionItems(...args);
  }

  /**
   * Get listed NFTs from the base account.
   * @param {...any} args - Arguments passed to filter or identify listed NFTs.
   * @returns {Promise<Array>} - Listed NFTs.
   */
  async getListedNfts(...args) {
    return this.base.getListedNfts(...args);
  }

  /**
   * Get NFT bids. Renamed from getNftsBids to getNftBids for clarity.
   * @param {...any} args - Arguments passed to identify the NFT for which to get bids.
   * @returns {Promise<Array>} - A list of bids for the NFT.
   */
  async getNftBids(...args) {
    return this.base.getNftsBids(...args); // Assuming base method is getNftsBids; ideally, rename base method as well.
  }

  /**
   * Create a transaction to burn an NFT.
   * @param {...any} args - Arguments required to create an NFT burn transaction.
   * @returns {Promise<*>} - The burn transaction details.
   */
  async createNftBurnTx(...args) {
    return this.base.createNftBurnTx(...args);
  }

  /**
   * Confirm an NFT burn transaction.
   * @param {...any} args - Arguments required to confirm NFT burn.
   * @returns {Promise<*>} - The result of the burn confirmation.
   */
  async confirmNftBurn(...args) {
    return this.base.confirmNftBurn(...args);
  }

  /**
   * Get the best swap quote for a trade.
   * @param {...any} args - Arguments required to get the best swap quote.
   * @returns {Promise<*>} - The best swap quote.
   */
  async getBestSwapQuote(...args) {
    return this.base.getBestSwapQuote(...args);
  }

  /**
   * Expire a given swap quote.
   * @param {...any} args - Arguments to identify and expire the swap quote.
   * @returns {Promise<*>} - The expiration result.
   */
  async expireSwapQuote(...args) {
    return this.base.expireSwapQuote(...args);
  }

  /**
   * Estimate the fee for a set of transactions.
   * @param {...any} args - Arguments describing the transactions for fee estimation.
   * @returns {Promise<number>} - Estimated fee.
   */
  async estimateTransactionsFee(...args) {
    return this.base.estimateTransactionsFee(...args);
  }

  /**
   * Estimate the fee for a transfer.
   * @param {...any} args - Arguments describing the transfer for fee estimation.
   * @returns {Promise<number>} - Estimated transfer fee.
   */
  async estimateTransferFee(...args) {
    return this.base.estimateTransferFee(...args);
  }

  /**
   * Create a transfer transaction.
   * @param {...any} args - Arguments describing the transfer transaction.
   * @returns {Promise<*>} - The created transfer transaction details.
   */
  async createTransferTransaction(...args) {
    return this.base.createTransferTransaction(...args);
  }

  /**
   * Confirm a transfer transaction.
   * @param {...any} args - Arguments describing the transaction to confirm.
   * @returns {Promise<*>} - The result of the confirmation.
   */
  async confirmTransferTransaction(...args) {
    return this.base.confirmTransferTransaction(...args);
  }

  /**
   * Create a swap transaction.
   * @param {...any} args - Arguments required to create a swap transaction.
   * @returns {Promise<*>} - The created swap transaction.
   */
  async createSwapTransaction(...args) {
    return this.base.createSwapTransaction(...args);
  }

  /**
   * List an NFT for sale.
   * @param {...any} args - Arguments required to list the NFT.
   * @returns {Promise<*>} - The result of the listing.
   */
  async listNft(...args) {
    return this.base.listNft(...args);
  }

  /**
   * Unlist an NFT from sale.
   * @param {...any} args - Arguments required to unlist the NFT.
   * @returns {Promise<*>} - The result of the unlisting.
   */
  async unlistNft(...args) {
    return this.base.unlistNft(...args);
  }

  /**
   * Buy an NFT from a listing.
   * @param {...any} args - Arguments required to buy the NFT.
   * @returns {Promise<*>} - The result of the purchase.
   */
  async buyNft(...args) {
    return this.base.buyNft(...args);
  }

  /**
   * Place a bid on an NFT.
   * @param {...any} args - Arguments required to place a bid.
   * @returns {Promise<*>} - The result of placing the bid.
   */
  async bidNft(...args) {
    return this.base.bidNft(...args);
  }

  /**
   * Cancel a previously placed bid on an NFT.
   * @param {...any} args - Arguments required to cancel the bid.
   * @returns {Promise<*>} - The result of the bid cancellation.
   */
  async cancelBidNft(...args) {
    return this.base.cancelBidNft(...args);
  }

  /**
   * Retrieve a specific transaction by its identifier or parameters.
   * @param {...any} args - Arguments identifying the transaction.
   * @returns {Promise<*>} - The transaction details.
   */
  async getTransaction(...args) {
    return this.base.getTransaction(...args);
  }

  /**
   * Get recent transactions. Results are cached.
   * @param {...any} args - Arguments for filtering or limiting transactions.
   * @returns {Promise<Array>} - A list of recent transactions.
   */
  async getRecentTransactions(...args) {
    const key = this.baseKey();
    return cache(key, CACHE_TYPES.TRANSACTIONS, () =>
      this.base.getRecentTransactions(...args),
    );
  }

  /**
   * Get the domain associated with the account (if applicable).
   * @returns {Promise<string|null>} - The domain name or null if not available.
   */
  async getDomain() {
    return this.base.getDomain();
  }

  /**
   * Get a domain from a public key.
   * @param {...any} args - Arguments to identify the domain from the public key.
   * @returns {Promise<string|null>} - The domain or null if not found.
   */
  async getDomainFromPublicKey(...args) {
    return this.base.getDomainFromPublicKey(...args);
  }

  /**
   * Get a public key from a domain.
   * @param {...any} args - Arguments to identify the public key from the domain.
   * @returns {Promise<string|null>} - The public key or null if not found.
   */
  async getPublicKeyFromDomain(...args) {
    return this.base.getPublicKeyFromDomain(...args);
  }

  /**
   * Scan for transactions based on specific criteria.
   * @param {...any} args - Arguments that define scanning criteria.
   * @returns {Promise<Array>} - A list of matched transactions.
   */
  async scanTransactions(...args) {
    return this.base.scanTransactions(...args);
  }

  /**
   * Get available tokens from the network. Results are cached.
   * @returns {Promise<Array>} - A list of available tokens.
   */
  async getAvailableTokens() {
    const key = this.network.id;
    return cache(key, CACHE_TYPES.AVAILABLE_TOKENS, () =>
      this.base.getAvailableTokens(),
    );
  }

  /**
   * Get featured tokens from the network. Results are cached.
   * @returns {Promise<Array>} - A list of featured tokens.
   */
  async getFeaturedTokens() {
    const key = this.network.id;
    return cache(key, CACHE_TYPES.FEATURED_TOKENS, () =>
      this.base.getFeaturedTokens(),
    );
  }
}

module.exports = CachedBlockchainAccount;
