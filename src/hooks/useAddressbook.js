import { useState, useEffect } from 'react';
import { getNetwork, getNetworks } from 'eclipse-wallet-adapter';
import storage from '../utils/storage';
import STORAGE_KEYS from '../utils/storageKeys';

const parse = ({ address, domain, name, networkId }, networks) => ({
  address,
  domain,
  name,
  network: networks.find(({ id }) => id === networkId),
});

const format = ({ address, domain, name, network }) => ({
  address,
  domain,
  name,
  networkId: network.id,
});

const useAddressbook = () => {
  const [addressBook, setAddressbook] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const storedAddress = await storage.getItem(STORAGE_KEYS.ADDRESS);
      if (storedAddress) {
        const networks = await getNetworks();
        const newAddressBook = storedAddress
          .map(({ address, chain, domain, name }) => ({
            name,
            address,
            domain,
            networkId: networks.find(
              ({ blockchain }) =>
                blockchain.toUpperCase() === chain.toUpperCase(),
            )?.id,
          }))
          .filter(({ networkId }) => !!networkId);

        await storage.setItem(STORAGE_KEYS.ADDRESS_BOOK, newAddressBook);
        await storage.removeItem(STORAGE_KEYS.ADDRESS)
      }

      const networks = await getNetworks();
      const items = (await storage.getItem(STORAGE_KEYS.ADDRESS_BOOK)) || [];
      setAddressbook(items.map(item => parse(item, networks)));
      setReady(true);
    };

    load();
  }, []);

  const addAddress = async ({ address, domain, name, networkId }) => {
    const network = await getNetwork(networkId);
    const newAddressBook = [...addressBook, { address, domain, name, network }];
    await storage.setItem(
      STORAGE_KEYS.ADDRESS_BOOK,
      newAddressBook.map(format),
    );
    setAddressbook(newAddressBook);
  };

  const editAddress = async (
    oldAddress,
    { address, domain, name, networkId },
  ) => {
    const network = await getNetwork(networkId);
    const newAddressBook = [
      ...addressBook.filter(item => item.address !== oldAddress),
      { address, domain, name, network },
    ];
    await storage.setItem(
      STORAGE_KEYS.ADDRESS_BOOK,
      newAddressBook.map(format),
    );
    setAddressbook(newAddressBook);
  };

  const removeAddress = async address => {
    const newAddressBook = addressBook.filter(a => a.address !== address);
    await storage.setItem(
      STORAGE_KEYS.ADDRESS_BOOK,
      newAddressBook.map(format),
    );
    setAddressbook(newAddressBook);
  };

  return [
    { addressBook, ready },
    { addAddress, editAddress, removeAddress },
  ];
};

export default useAddressbook;
