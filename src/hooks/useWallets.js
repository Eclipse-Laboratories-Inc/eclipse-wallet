import { useState, useEffect } from 'react';
import storage from '../utils/storage';
import isNil from 'lodash/isNil';
import { lock, unlock } from '../utils/password';
import { getChains, getDefaultEndpoint, recoverAccount } from '../utils/wallet';

const STORAGE_KEYS = {
  WALLETS: 'wallets',
  ENDPOINTS: 'endpoints',
  ACTIVE: 'active',
};

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
  return await recoverAccount(
    walletInfo.chain,
    walletInfo.mnemonic,
    endpoints[walletInfo.chain],
  );
};

const useWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [activeWallet, setActiveWallet] = useState(null);
  const [walletNumber, setWalletNumber] = useState();
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [requiredLock, setRequiredLock] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState({});
  const waitUntilUnlock = async w => {
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
  const unlockWallets = async password => {
    try {
      const storedWallets = await storage.getItem(STORAGE_KEYS.WALLETS);
      const unlockedWallets = await unlock(storedWallets.wallets, password);
      const activeIndex = await storage.getItem(STORAGE_KEYS.ACTIVE);
      setWallets(unlockedWallets);
      if (!isNil(activeIndex)) {
        try {
          const account = await getWalletAccount(
            activeIndex,
            unlockedWallets,
            selectedEndpoints,
          );
          setActiveWallet(account);
          setWalletNumber(activeIndex + 1);
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
  };
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
          if (!isNil(activeIndex)) {
            try {
              const account = await getWalletAccount(
                activeIndex,
                storedWallets.wallets,
                activeEndpoints,
              );
              setActiveWallet(account);
              setWalletNumber(activeIndex + 1);
            } catch (error) {
              // await storage.removeItem(STORAGE_KEYS.WALLETS);
              console.log(error);
            }
          }
        } else {
          waitUntilUnlock(storedWallets.wallets);
        }
        setReady(true);
      } else {
        // NO WALLETS, MOVE TO WELCOME
        setReady(true);
      }
    });
  }, []);

  const addWallet = async (account, password, chain) => {
    setActiveWallet(account);
    const address = await account.getReceiveAddress();
    const path = account.path;
    const currentIndex = wallets.findIndex(w => w.address === address);
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
        wallets: encryptedWallets,
      });
      setRequiredLock(true);
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        wallets: storedWallets,
      });
    }
    setWallets(storedWallets);
    await storage.setItem(
      STORAGE_KEYS.ACTIVE,
      noIndex(currentIndex) ? storedWallets.length - 1 : currentIndex,
    );
    setWalletNumber(
      noIndex(currentIndex) ? storedWallets.length : currentIndex + 1,
    );
  };

  const addDerivedAccounts = async (accounts, password, chain) => {
    const derivedAccounts = accounts.map(account => ({
      address: account.getReceiveAddress(),
      path: account.path,
      chain,
      mnemonic: activeWallet.mnemonic,
    }));
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
      });
    } else {
      await storage.setItem(STORAGE_KEYS.WALLETS, {
        passwordRequired: false,
        wallets: storedWallets,
      });
    }
    setWallets(storedWallets);
  };

  const changeActiveWallet = async walletIndex => {
    const account = await getWalletAccount(
      walletIndex,
      wallets,
      selectedEndpoints,
    );
    await storage.setItem(STORAGE_KEYS.ACTIVE, walletIndex);
    setActiveWallet(account);
    setWalletNumber(walletIndex + 1);
  };

  const changeEndpoint = async (chain, value) => {
    const endpoints = {
      ...selectedEndpoints,
      [chain]: value,
    };
    setSelectedEndpoints(endpoints);
    await storage.setItem(STORAGE_KEYS.ENDPOINTS, endpoints);
    activeWallet.setNetwork(value);
  };
  const removeAllWallets = async () => {
    await storage.clear();
    setWallets([]);
    setActiveWallet(null);
    setWalletNumber();
    setRequiredLock(false);
  };
  return [
    {
      ready,
      locked,
      wallets,
      activeWallet,
      selectedEndpoints,
      walletNumber,
      requiredLock,
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
    },
  ];
};

export default useWallets;
