import EncryptedStorage from 'react-native-encrypted-storage';

const storage = {
  getItem: async key => {
    try {
      const value = await EncryptedStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.log(error);
      await EncryptedStorage.removeItem(key);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await EncryptedStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  },
  removeItem: async key => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  },
  clear: async () => {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.log(error);
    }
  },
};

export default storage;
