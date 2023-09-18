const EXPLICIT_REGEXP = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;

const INVALID_ADDRESS = {
  type: 'ERROR',
  code: 'INVALID_ADDRESS',
};
const EMPTY_ACCOUNT = {
  type: 'WARNING',
  code: 'EMPTY_ACCOUNT',
};
const NO_FUNDS = {
  type: 'WARNING',
  code: 'NO_FUNDS',
};

const VALID_ACCOUNT = {
  type: 'SUCCESS',
  code: 'VALID_ACCOUNT',
};

const validateDestinationAccount = async (connection, accountId) => {
  if (!accountId || accountId.length < 2 || accountId.length > 64) {
    return INVALID_ADDRESS;
  }

  const isExplicit = EXPLICIT_REGEXP.test(accountId);

  if (!isExplicit) {
    if (accountId.length !== 64) {
      return INVALID_ADDRESS;
    }
    if (Buffer.from(accountId, 'base64').toString('base64') !== accountId) {
      return INVALID_ADDRESS;
    }
  }

  try {
    const response = await connection.connection.provider.query({
      request_type: 'view_account',
      finality: 'final',
      account_id: accountId,
    });

    if (response?.result?.amount == 0) {
      return NO_FUNDS;
    }

    return VALID_ACCOUNT;
  } catch (e) {
    if (!isExplicit && e.type === 'AccountDoesNotExist') {
      return EMPTY_ACCOUNT;
    }
    return INVALID_ADDRESS;
  }
};

module.exports = {
  validateDestinationAccount,
};
