'use strict';

class TransactionError extends Error {
  constructor(message, transactionId) {
    super(message);
    this.name = 'TransactionError';
    this.transactionId = transactionId;
  }
}

module.exports = TransactionError;
