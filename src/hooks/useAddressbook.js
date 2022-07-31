import { useState, useEffect } from 'react';
import storage from '../utils/storage';
// addressBook: [
//   {
//     name: 'TEST 1',
//     address: 'MjMRoC8j1P2732DapDq6SjzhJ7kq2p',
//     chain: 'SOLANA',
//   },
//   {
//     name: 'TEST 2',
//     address: 'LjMRoC8j1P2732DapDq6SjzhJ7kq2p',
//     chain: 'SOLANA',
//   },
// ],

const STORAGE_KEYS = {
  ADDRESS: 'address',
};

const useAddressbook = () => {
  const [addressBook, setAddressbook] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    storage.getItem(STORAGE_KEYS.ADDRESS).then(address => {
      if (address) {
        setAddressbook(address);
      }
      setReady(true);
    });
  }, []);
  const addAddress = async address => {
    const tmpAddress = [...addressBook, address];
    await storage.setItem(STORAGE_KEYS.ADDRESS, tmpAddress);
    setAddressbook(tmpAddress);
  };
  const editAddress = async (oldAddress, address) => {
    const tmpAddress = [
      ...addressBook.filter(a => a.address !== oldAddress.address),
      address,
    ];
    await storage.setItem(STORAGE_KEYS.ADDRESS, tmpAddress);
    setAddressbook(tmpAddress);
  };
  const removeAddress = async address => {
    const tmpAddress = addressBook.filter(a => a.address !== address.address);
    await storage.setItem(STORAGE_KEYS.ADDRESS, tmpAddress);
    setAddressbook(tmpAddress);
  };
  return [
    { addressBook, ready },
    { addAddress, editAddress, removeAddress },
  ];
};

export default useAddressbook;
