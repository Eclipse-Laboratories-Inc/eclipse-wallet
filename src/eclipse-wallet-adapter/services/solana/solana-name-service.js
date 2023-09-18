const {
  performReverseLookup,
  getDomainKey,
  NameRegistryState,
  NAME_PROGRAM_ID,
  getFilteredProgramAccounts,
} = require('@bonfida/spl-name-service');
const { PublicKey } = require('@solana/web3.js');

const SOL_TLD_AUTHORITY = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx');

const getDomainName = async (connection, publicKey) => {
  try {
    const result = await performReverseLookup(connection, new PublicKey(publicKey));
    return result;
  } catch (e) {
    console.debug(e);
    return null;
  }
};

const getPublicKey = async (connection, domain) => {
  const { pubkey } = await getDomainKey(domain);
  const { registry } = await NameRegistryState.retrieve(connection, pubkey);
  const owner = registry.owner;
  return owner.toBase58();
};

module.exports = {
  getDomainName,
  getPublicKey,
};
