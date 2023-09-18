const axios = require('axios').default;
const {
  Transaction,
  PublicKey,
  VersionedMessage,
  VersionedTransaction,
} = require('@solana/web3.js');
const TransactionError = require('../../errors/TransactionError');
const { ME_PROGRAM_ID } = require('../../constants/token-constants');
const { SALMON_API_URL } = require('../../constants/environment');

const getAll = async (network, publicKey, noCache = false) => {
  const params = { publicKey, noCache };
  const { data } = await axios.get(`${SALMON_API_URL}/v1/${network.id}/nft`, { params });
  return data;
};

const getAllGroupedByCollection = async (network, owner) => {
  const nfts = await getAll(network, owner);
  const nftsByCollection = getNftsByCollection(nfts);
  const nftsWithoutCollection = getNftsWithoutCollection(nfts);
  return [...nftsByCollection, ...nftsWithoutCollection];
};

const getCollections = (nfts) => {
  const collections = nfts.map((nft) => nft.collection?.name).filter((e) => e !== undefined);
  return Array.from(new Set(collections));
};

const getNftsByCollection = (nfts) => {
  const collections = getCollections(nfts);
  return collections
    .map((collection) => {
      const items = nfts.filter((nft) => nft.collection?.name === collection);
      const length = items.length;
      return {
        collection,
        length,
        items,
        thumb: items[0].media,
      };
    })
    .sort((a, b) => b.length - a.length);
};

const getNftsWithoutCollection = (nfts) => {
  return nfts.filter((nft) => !nft.collection);
};

const getNftByAddress = async (network, mintAddress) => {
  try {
    const response = await axios.get(`${SALMON_API_URL}/v1/${network.id}/nft/${mintAddress}`);
    if (response?.data?.collection) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getCollectionGroupByFilter = async (network, filterType) => {
  try {
    const response = await axios.get(
      `${SALMON_API_URL}/v1/${network.id}/nft/hyperspace/collections/${filterType}`
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getCollectionById = async (network, collectionId) => {
  try {
    const response = await axios.get(
      `${SALMON_API_URL}/v1/${network.id}/nft/hyperspace/collection/${collectionId}`
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getCollectionItemsById = async (network, collectionId, pageNumber) => {
  try {
    const response = await axios.get(
      `${SALMON_API_URL}/v1/${network.id}/nft/hyperspace/collection/${collectionId}/items/${pageNumber}`
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const burnNft = async (connection, transaction, signer) => {
  const txid = await connection.sendTransaction(transaction, [signer], {
    skipPreflight: true,
  });

  console.log(`Send transaction with id ${txid}.`);

  const confirmation = await connection.confirmTransaction(txid, 'confirmed');
  if (confirmation?.value?.err) {
    console.error(confirmation);
    throw new TransactionError(`The transaction with id ${txid} cannot be confirmed.`, txid);
  }

  return txid;
};

const createNftBurnTx = async (network, mint, signer) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/${mint}?owner=${signer}`;
  const { data } = await axios.post(url, null);

  // for some reason serialize/deserialize transaction from api to the adapter
  // doesn't work properly, so, I rebuild the transaction from the response data
  // (transaction in JSON format)
  const transaction = new Transaction();

  transaction.recentBlockhash = data.recentBlockhash;
  transaction.feePayer = signer;

  const instructions = data.instructions;

  const keys = instructions[0].keys.map((k) => {
    const { pubkey, ...rest } = k;

    return { pubkey: new PublicKey(pubkey), ...rest };
  });

  instructions[0].keys = keys;
  instructions[0].programId = new PublicKey(instructions[0].programId);
  transaction.instructions = instructions;

  return transaction;
};

const getListedByOwner = async (network, ownerAddress) => {
  try {
    const response = await axios.get(
      `${SALMON_API_URL}/v1/${network.id}/nft/listed/${ownerAddress}`
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getBidsByOwner = async (network, ownerAddress) => {
  try {
    const response = await axios.get(`${SALMON_API_URL}/v1/${network.id}/nft/bids/${ownerAddress}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const listNft = async (network, connection, keyPair, tokenAddress, price) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/list-tx`;
  const params = {
    sellerAddress: keyPair.publicKey.toBase58(),
    tokenAddress,
    price,
  };
  const response = await axios.get(url, { params });
  const { createListTx } = response.data;
  const data = createListTx.data;
  return sendSerializedTx(connection, data, keyPair);
};

const unlistNft = async (network, connection, keyPair, tokenAddress) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/unlist-tx`;
  const params = { sellerAddress: keyPair.publicKey.toBase58(), tokenAddress };
  const response = await axios.get(url, { params });
  const { createDelistTx } = response.data;
  const data = createDelistTx.data;
  return sendSerializedTx(connection, data, keyPair);
};

const buyNft = async (network, connection, keyPair, tokenAddress, price, marketplaceId) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/buy-tx`;
  const params = { buyerAddress: keyPair.publicKey.toBase58(), tokenAddress, price };
  const response = await axios.get(url, { params });
  const { createBuyTx } = response.data;
  const data = createBuyTx.data;
  if (marketplaceId === ME_PROGRAM_ID) {
    return sendRawTx(connection, data, keyPair);
  } else {
    return sendSerializedTx(connection, data, keyPair);
  }
};

const bidNft = async (network, connection, keyPair, tokenAddress, price) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/bid-tx`;
  const params = { buyerAddress: keyPair.publicKey.toBase58(), tokenAddress, price };
  const response = await axios.get(url, { params });
  const { createBidTx } = response.data;
  const data = createBidTx.data;
  return sendSerializedTx(connection, data, keyPair);
};

const cancelBidNft = async (network, connection, keyPair, tokenAddress) => {
  const url = `${SALMON_API_URL}/v1/${network.id}/nft/cancel-bid-tx`;
  const params = { buyerAddress: keyPair.publicKey.toBase58(), tokenAddress };
  const response = await axios.get(url, { params });
  const { createCancelBidTx } = response.data;
  const data = createCancelBidTx.data;
  return sendSerializedTx(connection, data, keyPair);
};

const sendSerializedTx = async (connection, txBuffer, keyPair) => {
  const message = VersionedMessage.deserialize(Buffer.from(txBuffer));
  const transaction = new VersionedTransaction(message);
  transaction.sign([keyPair]);
  const txId = await connection.sendTransaction(transaction, { skipPreflight: true });
  return txId;
};

const sendRawTx = async (connection, txBuffer, keyPair) => {
  const transaction = Transaction.from(Buffer.from(txBuffer));
  transaction.partialSign(keyPair);
  const txId = await connection.sendRawTransaction(transaction.serialize());
  return txId;
};

module.exports = {
  getAll,
  getAllGroupedByCollection,
  getNftByAddress,
  getCollectionGroupByFilter,
  getCollectionById,
  getCollectionItemsById,
  createNftBurnTx,
  burnNft,
  getListedByOwner,
  getBidsByOwner,
  listNft,
  unlistNft,
  buyNft,
  bidNft,
  cancelBidNft,
};
