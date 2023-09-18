const bip39 = require('bip39');
const { AccountFactory } = require('../index');

test('create new account', async () => {
  const account = await AccountFactory.create({ name: 'New account' });
  const { id, name, avatar, mnemonic, networksAccounts } = account;
  expect(id).toBeDefined();
  expect(name).toBe('New account');
  expect(avatar).toBeDefined();
  expect(mnemonic).toBeDefined();
  expect(mnemonic.split(' ').length).toBe(12);
  expect(bip39.validateMnemonic(mnemonic)).toBe(true);
  expect(networksAccounts).toBeDefined();
  expect(Object.keys(networksAccounts).length).toBeGreaterThan(0);
});
