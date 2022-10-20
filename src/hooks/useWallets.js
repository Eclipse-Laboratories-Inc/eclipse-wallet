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
  recoverAccount,
  recoverDerivedAccount,
} from '../utils/wallet';

const STORAGE_KEYS = {
  WALLETS: 'wallets',
  ENDPOINTS: 'endpoints',
  ACTIVE: 'active',
};

const WALLET_PLACEHOLDER = 'Wallet NRO';
const WALLET_DERIVED_PLACEHOLDER = 'Wallet Derived NRO';

const DEFAULT_PATH = "m/44'/501'/0'/0'";

const noIndex = idx => idx === -1;

const buildEndpoints = () =>
  getChains().reduce(
    (endpoints, chain) => ({
      ...endpoints,
      [chain]: getDefaultEndpoint(chain),
    }),
    {},
  );

const getWalletAccount = async (index, wallets, endpoints) => {
  const walletInfo = wallets[index];
  const isDerived = walletInfo.path !== DEFAULT_PATH;
  if (isDerived) {
    return await recoverDerivedAccount(
      walletInfo.chain,
      walletInfo.mnemonic,
      walletInfo.path,
      endpoints[walletInfo.chain],
    );
  }
  return await recoverAccount(
    walletInfo.chain,
    walletInfo.mnemonic,
    endpoints[walletInfo.chain],
  );
};

const useWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [config, setConfig] = useState({});
  const [lastNumber, setLastNumber] = useState(0);
  const [activeWallet, setActiveWallet] = useState(null);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [requiredLock, setRequiredLock] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState({});
  const waitUntilUnlock = w => {
    setRequiredLock(true);
    setLocked(true);
    setWallets(w);
  };
  const checkPassword = async password => {
    try {
      const storedWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
      await unlock(storedWallets.wallets, password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const unlockWalletsAt = useCallback(async (password, endpoints) => {
    try {
      const storedWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
      const unlockedWallets = await unlock(storedWallets.wallets, password);
      const activeIndex = await storage.getItem(STORAGE_KEYS.ACTIVE);
      setWallets(unlockedWallets);
      setConfig(storedWallets.config || {});
      setLastNumber(storedWallets.lastNumber || unlockedWallets.length);
      if (!isNil(activeIndex)) {
        try {
          const account = await getWalletAccount(
            activeIndex,
            unlockedWallets,
            endpoints,
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
  }, []);

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
  };

  useEffect(() => {
    Promise.all([
      storage.getItem(STORAGE_KEYS.WALLETS),
      storage.getItem(STORAGE_KEYS.ACTIVE),
      storage.getItem(STORAGE_KEYS.ENDPOINTS),
    ]).then(async ([storedWallets, activeIndex, endpoints]) => {
      const activeEndpoints = endpoints || buildEndpoints();
      setSelectedEndpoints(activeEndpoints);
      if (storedWallets && storedWallets.wallets) {
        if (!storedWallets.passwordRequired) {
          setWallets(storedWallets.wallets);
          setConfig(storedWallets.config || {});
          setLastNumber(
            storedWallets.lastNumber || storedWallets.wallets.length,
          );
          if (!isNil(activeIndex)) {
            try {
              const account = await getWalletAccount(
                activeIndex,
                storedWallets.wallets,
                activeEndpoints,
              );
              setActiveWallet(account);
            } catch (error) {
              // await storage.removeItem(STORAGE_KEYS.WALLETS);
              console.log(error);
            }
          }
        } else {
          let result = false;
          const password = await stash.getItem('password');
          if (password) {
            result = await unlockWalletsAt(password, activeEndpoints);
          }
          if (!result) {
            waitUntilUnlock(storedWallets.wallets);
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
    const storedWallets = [
      ...wallets,
      ...(noIndex(currentIndex)
        ? [
            {
              address,
              path,
              chain,
              mnemonic: account.mnemonic,
            },
          ]
        : []),
    ];
    if (password) {
      const encryptedWallets = await lock(storedWallets, password);
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: true,
        lastNumber: _lastNumber,
        config: _config,
        wallets: encryptedWallets,
      });
      setRequiredLock(true);
      await stash.setItem('password', password);
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        lastNumber: _lastNumber,
        config: _config,
        wallets: storedWallets,
      });
    }
    setWallets(storedWallets);
    setLastNumber(_lastNumber);
    setConfig(_config);
    await storage.setItem(
      STORAGE_KEYS.ACTIVE,
      noIndex(currentIndex) ? storedWallets.length - 1 : currentIndex,
    );
  };

  const addDerivedAccounts = async (accounts, password, chain) => {
    const derivedAccounts = accounts.map(account => ({
      address: account.getReceiveAddress(),
      path: account.path,
      chain,
      mnemonic: activeWallet.mnemonic,
    }));
    const derConfig = derivedAccounts.reduce(
      (a, v) => ({
        ...a,
        [v.address]: {
          name: WALLET_DERIVED_PLACEHOLDER.replace('NRO', v.path.charAt(11)),
          avatar: getRandomAvatar(),
        },
      }),
      {},
    );
    const storedWallets = [
      ...wallets.filter(
        w => !derivedAccounts.some(da => da.address === w.address),
      ),
      ...derivedAccounts,
    ];
    if (password) {
      const encryptedWallets = await lock(storedWallets, password);
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: true,
        wallets: encryptedWallets,
        config: { ...config, ...derConfig },
      });
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        wallets: storedWallets,
        config: { ...config, ...derConfig },
      });
    }
    setWallets(storedWallets);
    setConfig({ ...config, ...derConfig });
  };

  const changeActiveWallet = async walletIndex => {
    const account = await getWalletAccount(
      walletIndex,
      wallets,
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
    setWallets([]);
    setActiveWallet(null);
    setLocked(false);
    setRequiredLock(false);
  };
  const removeWallet = async address => {
    const newWallArr = wallets.filter(w => w.address !== address);
    setWallets(newWallArr);
    const _config = { ...config };
    delete _config[address];
    setConfig(_config);
    await storage.setItem(STORAGE_KEYS.WALLETS, {
      passwordRequired: false,
      lastNumber: lastNumber,
      config: _config,
      wallets: newWallArr,
    });
    if (newWallArr.length) {
      await changeActiveWallet(wallets.findIndex(w => w.address !== address));
    } else {
      removeAllWallets();
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
      activeWallet,
      selectedEndpoints,
      requiredLock,
      config,
    },
    {
      setWallets,
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
