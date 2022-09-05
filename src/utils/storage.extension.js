/* eslint-disable no-undef */
const storage = {
  getItem: async key =>
    new Promise((resolve, reject) => {
      chrome.storage.local.get(key, result => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(result[key] || null));
        }
      });
    }),
  setItem: async (key, value) =>
    new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: JSON.stringify(value) }, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }),
  removeItem: async key =>
    new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }),
  clear: async () =>
    new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }),
};

export default storage;
