'use strict';

class Account {
  constructor(id, name, avatar, mnemonic, networksAccounts) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.mnemonic = mnemonic;
    this.networksAccounts = networksAccounts;
  }
}

module.exports = Account;
