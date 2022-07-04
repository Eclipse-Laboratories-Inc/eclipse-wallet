import { useState, useEffect } from 'react';
import storage from '../utils/storage';
import isNil from 'lodash/isNil';
import { lock } from '../utils/password';
import { getChains, getDefaultEndpoint, recoverAccount } from '../utils/wallet';

const STORAGE_KEYS = {
  WALLETS: 'wallets',
  ENDPOINTS: 'endpoints',
  ACTIVE: 'active',
};

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
  const [ready, setReady] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState({});
  useEffect(() => {
    Promise.all([
      storage.getItem(STORAGE_KEYS.WALLETS),
      storage.getItem(STORAGE_KEYS.ACTIVE),
      storage.getItem(STORAGE_KEYS.ENDPOINTS),
    ]).then(async ([storedWallets, activeIndex, endpoints]) => {
      const activeEndpoints = endpoints || buildEndpoints();
      setSelectedEndpoints(activeEndpoints);
      if (storedWallets) {
        setWallets(storedWallets);
        if (!isNil(activeIndex)) {
          try {
            const account = await getWalletAccount(
              activeIndex,
              storedWallets,
              activeEndpoints,
            );
            setActiveWallet(account);
          } catch (error) {
            await storage.removeItem(STORAGE_KEYS.WALLETS);
          }
        }
      }
      setReady(true);
    });
  }, []);

  const addWallet = async (account, password, chain) => {
    // TODO: LOCK storedWallets (unlock and lock)
    // await lock(storedWallets, password)
    setActiveWallet(account);
    const address = await account.getReceiveAddress();
    const path = account.path;
    const storedWallets = [
      ...wallets.filter(w => w.address !== address),
      {
        address,
        path,
        chain,
        mnemonic: account.mnemonic,
      },
    ];
    await storage.setItem(STORAGE_KEYS.WALLETS, storedWallets);
    await storage.setItem(STORAGE_KEYS.ACTIVE, storedWallets.length - 1);
  };

  const addDerivedAccounts = async (accounts, password, chain) => {
    const derivedAccounts = await Promise.all(
      accounts.map(account =>
        account.getReceiveAddress().then(address => ({
          address,
          path: account.path,
          chain,
          mnemonic: activeWallet.mnemonic,
        })),
      ),
    );
    const storedWallets = [
      ...wallets.filter(
        w => !derivedAccounts.some(da => da.address === w.address),
      ),
      ...derivedAccounts,
    ];
    await storage.setItem(STORAGE_KEYS.WALLETS, storedWallets);
  };

  const changeEndpoint = (chain, value) =>
    setSelectedEndpoints({
      ...selectedEndpoints,
      [chain]: value,
    });

  return [
    { ready, wallets, activeWallet, selectedEndpoints },
    {
      setWallets,
      setActiveWallet,
      changeEndpoint,
      addWallet,
      addDerivedAccounts,
    },
  ];
};

export default useWallets;
