import { useState, useEffect, useCallback } from 'react';
import stash from '../utils/stash';
import storage from '../utils/storage';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import omit from 'lodash/omit';

import { lock, unlock } from '../utils/password';
import {
  getChains,
  getDefaultEndpoint,
  isDefaultPath,
  recoverAccount,
  recoverDerivedAccount,
} from '../utils/wallet';

const STORAGE_KEYS = {
  WALLETS: 'wallets',
  ENDPOINTS: 'endpoints',
  EXPLORERS: 'explorers',
  ACTIVE: 'active',
};

const WALLET_PLACEHOLDER = 'Wallet NRO';
const WALLET_DERIVED_PLACEHOLDER = 'Wallet Derived NRO';

const noIndex = idx => idx === -1;

const buildEndpoints = () =>
  getChains().reduce(
    (endpoints, chain) => ({
      ...endpoints,
      [chain]: getDefaultEndpoint(chain),
    }),
    {},
  );

const getWalletAccount = async (
  index,
  wallets,
  mnemonics,
  endpoints,
  explorers,
) => {
  const walletInfo = wallets[index];
  if (!isDefaultPath(walletInfo.path)) {
    return await recoverDerivedAccount(
      walletInfo.chain,
      mnemonics[walletInfo.address],
      walletInfo.path,
      endpoints[walletInfo.chain],
    );
  }
  return await recoverAccount(
    walletInfo.chain,
    mnemonics[walletInfo.address],
    endpoints[walletInfo.chain],
  );
};

const useWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [mnemonics, setMnemonics] = useState({});
  const [config, setConfig] = useState({});
  const [lastNumber, setLastNumber] = useState(0);
  const [activeWallet, setActiveWallet] = useState(null);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [requiredLock, setRequiredLock] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState({});
  const checkPassword = async password => {
    try {
      const storedWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
      await unlock(storedWallets.mnemonics, password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const unlockWalletsAt = useCallback(
    async (password, endpoints, explorers) => {
      try {
        const storedWallets = await storage.getItem(STORAGE_KEYS.WALLETS);

        /****************************************/
        // Previous versions stored mnemonics inside wallets array info
        // so entire wallets info was encrypted. Now mnemonics are stored separately.
        if (!('mnemonics' in storedWallets)) {
          storedWallets.wallets = await unlock(storedWallets.wallets, password);
          storedWallets.mnemonics = await lock(
            storedWallets.wallets.reduce((m, wallet) => {
              m[wallet.address] = wallet.mnemonic;
              delete wallet.mnemonic;
              return m;
            }, {}),
            password,
          );
          await storage.setItem(STORAGE_KEYS.WALLETS, storedWallets);
        }
        /****************************************/

        const unlockedMnemonics = await unlock(
          storedWallets.mnemonics,
          password,
        );
        const activeIndex = await storage.getItem(STORAGE_KEYS.ACTIVE);
        setWallets(storedWallets.wallets);
        setMnemonics(unlockedMnemonics);
        setConfig(storedWallets.config || {});
        setLastNumber(storedWallets.lastNumber || storedWallets.wallets.length);
        if (!isNil(activeIndex)) {
          try {
            const account = await getWalletAccount(
              activeIndex,
              storedWallets.wallets,
              unlockedMnemonics,
              endpoints,
              explorers,
            );
            setActiveWallet(account);
          } catch (error) {
            // await storage.removeItem(STORAGE_KEYS.WALLETS);
            console.log(error);
          }
        }
        setLocked(false);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [],
  );

  const unlockWallets = useCallback(
    async password => {
      const result = await unlockWalletsAt(password, selectedEndpoints);
      if (result === true) {
        await stash.setItem('password', password);
      }
      return result;
    },
    [unlockWalletsAt, selectedEndpoints],
  );

  const lockWallets = async () => {
    setLocked(true);
    await stash.removeItem('password');
  };

  useEffect(() => {
    stash.setItem('active_at', new Date());
  }, []);

  useEffect(() => {
    Promise.all([
      storage.getItem(STORAGE_KEYS.WALLETS),
      storage.getItem(STORAGE_KEYS.ACTIVE),
      storage.getItem(STORAGE_KEYS.ENDPOINTS),
      storage.getItem(STORAGE_KEYS.EXPLORERS),
    ]).then(async ([storedWallets, activeIndex, endpoints, explorers]) => {
      const activeEndpoints = endpoints || buildEndpoints();
      setSelectedEndpoints(activeEndpoints);
      if (storedWallets && storedWallets.wallets) {
        if (!storedWallets.passwordRequired) {
          /****************************************/
          // Previous versions stored mnemonics inside wallets array info
          // Now mnemonics are stored separately.
          if (!('mnemonics' in storedWallets)) {
            storedWallets.mnemonics = storedWallets.wallets.reduce(
              (m, wallet) => {
                m[wallet.address] = wallet.mnemonic;
                delete wallet.mnemonic;
                return m;
              },
              {},
            );
            storage.setItem(STORAGE_KEYS.WALLETS, storedWallets);
          }
          /****************************************/

          setWallets(storedWallets.wallets);
          setMnemonics(storedWallets.mnemonics);
          setConfig(storedWallets.config || {});
          setLastNumber(
            storedWallets.lastNumber || storedWallets.wallets.length,
          );
          if (!isNil(activeIndex)) {
            try {
              const account = await getWalletAccount(
                activeIndex,
                storedWallets.wallets,
                storedWallets.mnemonics,
                activeEndpoints,
              );
              setActiveWallet(account);
            } catch (error) {
              // await storage.removeItem(STORAGE_KEYS.WALLETS);
              console.log(error);
            }
          }
        } else {
          setRequiredLock(true);

          let result = false;
          const password = await stash.getItem('password');
          if (password) {
            result = await unlockWalletsAt(password, activeEndpoints);
          }
          if (!result) {
            setLocked(true);
          }
        }
        setReady(true);
      } else {
        // NO WALLETS, MOVE TO WELCOME
        setReady(true);
      }
    });
  }, [unlockWalletsAt]);

  const getRandomAvatar = () => {
    const rnd = Math.floor(Math.random() * 24) + 1;
    const index = rnd.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    return `http://static.salmonwallet.io/avatar/${index}.png`;
  };

  const addWallet = async (account, password, chain) => {
    setActiveWallet(account);
    const address = await account.getReceiveAddress();
    const path = account.path;
    const currentIndex = wallets.findIndex(w => w.address === address);
    const _lastNumber = lastNumber + 1;
    const _config = {
      ...config,
      [address]: {
        name: WALLET_PLACEHOLDER.replace('NRO', _lastNumber),
        avatar: getRandomAvatar(),
      },
    };
    const storedMnemonics = {
      ...mnemonics,
      [address]: account.mnemonic,
    };
    const _wallets = [
      ...wallets,
      ...(noIndex(currentIndex)
        ? [
            {
              address,
              path,
              chain,
            },
          ]
        : []),
    ];
    if (password) {
      const encryptedMnemonics = await lock(storedMnemonics, password);
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: true,
        lastNumber: _lastNumber,
        config: _config,
        mnemonics: encryptedMnemonics,
        wallets: _wallets,
      });
      setRequiredLock(true);
      await stash.setItem('password', password);
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        lastNumber: _lastNumber,
        config: _config,
        mmemonics: storedMnemonics,
        wallets: _wallets,
      });
    }
    setWallets(_wallets);
    setMnemonics(storedMnemonics);
    setLastNumber(_lastNumber);
    setConfig(_config);
    await storage.setItem(
      STORAGE_KEYS.ACTIVE,
      noIndex(currentIndex) ? _wallets.length - 1 : currentIndex,
    );
  };

  const addDerivedAccounts = async (accounts, password, chain) => {
    const derivedAccounts = accounts.map(account => ({
      address: account.getReceiveAddress(),
      path: account.path,
      chain,
    }));
    const _config = derivedAccounts.reduce(
      (a, v) => ({
        ...a,
        [v.address]: {
          name: WALLET_DERIVED_PLACEHOLDER.replace('NRO', v.path.charAt(11)),
          avatar: getRandomAvatar(),
        },
      }),
      config,
    );
    const storedMnemonics = derivedAccounts.reduce(
      (a, v) => ({
        ...a,
        [v.address]: activeWallet.mnemonic,
      }),
      mnemonics,
    );
    const _wallets = [
      ...wallets.filter(
        w => !derivedAccounts.some(da => da.address === w.address),
      ),
      ...derivedAccounts,
    ];
    if (password) {
      const encryptedMnemonics = await lock(storedMnemonics, password);
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: true,
        wallets: _wallets,
        mnemonics: encryptedMnemonics,
        config: _config,
      });
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        wallets: _wallets,
        mnemonics: storedMnemonics,
        config: _config,
      });
    }
    setWallets(_wallets);
    setMnemonics(storedMnemonics);
    setConfig(_config);
  };

  const changeActiveWallet = async walletIndex => {
    const account = await getWalletAccount(
      walletIndex,
      wallets,
      mnemonics,
      selectedEndpoints,
    );
    await storage.setItem(STORAGE_KEYS.ACTIVE, walletIndex);
    setActiveWallet(account);
  };

  const changeEndpoint = async (chain, value) => {
    const endpoints = {
      ...selectedEndpoints,
      [chain]: value,
    };
    setSelectedEndpoints(endpoints);
    await storage.setItem(STORAGE_KEYS.ENDPOINTS, endpoints);
    if (activeWallet) {
      activeWallet.setNetwork(value);
    }
  };

  const removeAllWallets = async () => {
    await storage.clear();
    setConfig({});
    setLastNumber(0);
    setMnemonics({});
    setWallets([]);
    setActiveWallet(null);
    setLocked(false);
    setRequiredLock(false);
  };
  const removeWallet = async (address, password) => {
    const newWallArr = wallets.filter(w => w.address !== address);
    setWallets(newWallArr);
    const _mnemonics = { ...mnemonics };
    delete _mnemonics[address];
    setMnemonics(_mnemonics);
    const _config = { ...config };
    delete _config[address];
    setConfig(_config);
    if (password) {
      const encryptedMnemonics = await lock(_mnemonics, password);
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: true,
        lastNumber: lastNumber,
        config: _config,
        mnemonics: encryptedMnemonics,
        wallets: newWallArr,
      });
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        lastNumber: lastNumber,
        config: _config,
        mnemonics: _mnemonics,
        wallets: newWallArr,
      });
    }
    if (newWallArr.length) {
      if (activeWallet.getReceiveAddress() === address) {
        await changeActiveWallet(wallets.findIndex(w => w.address !== address));
      }
    } else {
      await removeAllWallets();
    }
  };
  const editWalletName = async (address, name) => {
    const _config = {
      ...config,
      [address]: {
        ...get(config, address, {}),
        name,
      },
    };
    const _storageWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
    await storage.setItem(STORAGE_KEYS.WALLETS, {
      ..._storageWallets,
      config: _config,
    });
    setConfig(_config);
  };
  const addTrustedApp = async (address, domain, { name, icon } = {}) => {
    const _config = {
      ...config,
      [address]: {
        ...get(config, address, {}),
        trustedApps: {
          ...get(config, `${address}.trustedApps`, {}),
          [domain]: { name, icon },
        },
      },
    };
    const _storageWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
    await storage.setItem(STORAGE_KEYS.WALLETS, {
      ..._storageWallets,
      config: _config,
    });
    setConfig(_config);
  };
  const removeTrustedApp = async (address, domain) => {
    const _config = {
      ...config,
      [address]: {
        ...get(config, address, {}),
        trustedApps: {
          ...omit(get(config, `${address}.trustedApps`, {}), domain),
        },
      },
    };
    const _storageWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
    await storage.setItem(STORAGE_KEYS.WALLETS, {
      ..._storageWallets,
      config: _config,
    });
    setConfig(_config);
  };
  const editWalletAvatar = async (address, avatar) => {
    const _config = {
      ...config,
      [address]: {
        ...get(config, address, {}),
        avatar,
      },
    };
    const _storageWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
    await storage.setItem(STORAGE_KEYS.WALLETS, {
      ..._storageWallets,
      config: _config,
    });
    setConfig(_config);
  };
  return [
    {
      ready,
      locked,
      wallets,
      mnemonics,
      activeWallet,
      selectedEndpoints,
      requiredLock,
      config,
    },
    {
      changeActiveWallet,
      changeEndpoint,
      addWallet,
      addDerivedAccounts,
      unlockWallets,
      lockWallets,
      checkPassword,
      removeAllWallets,
      removeWallet,
      editWalletName,
      editWalletAvatar,
      addTrustedApp,
      removeTrustedApp,
    },
  ];
};

export default useWallets;
