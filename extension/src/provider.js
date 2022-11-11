import EventEmitter from 'eventemitter3';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

export class SolanaProvider extends EventEmitter {
  #publicKey = null;
  #nextRequestId = 1;

  constructor() {
    super();
    this.#publicKey = null;
    this.#nextRequestId = 1;
  }

  get publicKey() {
    return this.#publicKey;
  }

  get isConnected() {
    return this.#publicKey !== null;
  }

  #encodeTransaction = transaction => {
    let serialized;
    if (typeof transaction.serializeMessage === 'function') {
      serialized = transaction.serializeMessage();
    } else {
      serialized = transaction.message.serialize();
    }
    return bs58.encode(serialized);
  };

  sendMessage = async message => {
    return new Promise((resolve, reject) => {
      const listener = event => {
        if (event.detail.id === message.id) {
          window.removeEventListener('salmon_contentscript_message', listener);

          if (event.detail.error) {
            reject(event.detail);
          } else {
            resolve(event.detail);
          }
        }
      };
      window.addEventListener('salmon_contentscript_message', listener);

      window.dispatchEvent(
        // eslint-disable-next-line no-undef
        new CustomEvent('salmon_injected_script_message', { detail: message }),
      );
    });
  };

  sendRequest = async (method, params) => {
    try {
      return await this.sendMessage({
        jsonrpc: '2.0',
        id: this.#nextRequestId++,
        method,
        params,
      });
    } catch ({ error }) {
      throw new Error(error);
    }
  };

  connect = async options => {
    const { method, params } = await this.sendRequest('connect', { options });
    if (method === 'connected') {
      this.#publicKey = new PublicKey(params.publicKey);
      return { publicKey: this.#publicKey };
    } else {
      throw new Error('Not connected');
    }
  };

  disconnect = async () => {
    const { method } = await this.sendRequest('disconnect', {});
    if (method === 'disconnected') {
      this.#publicKey = null;
    } else {
      throw new Error('Not disconnected');
    }
  };

  signAndSendTransaction = async (transaction, network, options) => {
    const { result } = await this.sendRequest('signAndSendTransaction', {
      message: this.#encodeTransaction(transaction),
      network,
      options,
    });
    return result;
  };

  signTransaction = async (transaction, network) => {
    const { result } = await this.sendRequest('signTransaction', {
      message: this.#encodeTransaction(transaction),
      network,
    });
    const signature = bs58.decode(result.signature);
    const publicKey = new PublicKey(result.publicKey);
    transaction.addSignature(publicKey, signature);
    return transaction;
  };

  signAllTransactions = async (transactions, network) => {
    const { result } = await this.sendRequest('signAllTransactions', {
      messages: transactions.map(this.#encodeTransaction),
      network,
    });
    const signatures = result.signatures.map(s => bs58.decode(s));
    const publicKey = new PublicKey(result.publicKey);
    transactions = transactions.map((tx, idx) => {
      tx.addSignature(publicKey, signatures[idx]);
      return tx;
    });
    return transactions;
  };

  signMessage = async message => {
    if (!(message instanceof Uint8Array)) {
      throw new Error('Data must be an instance of Uint8Array');
    }
    const { result } = await this.sendRequest('sign', { data: message });
    const signature = bs58.decode(result.signature);
    return { signature };
  };

  postMessage = async message => {
    try {
      const detail = await this.sendMessage(message);
      window.postMessage(detail);
    } catch (error) {
      window.postMessage(error);
    }
  };
}
