/* eslint-disable no-undef */
const channel = 'sollet_extension_stash_channel';

const stash = {
  getItem: async key =>
    new Promise(resolve => {
      chrome.runtime.sendMessage(
        { channel, data: { method: 'get', key } },
        resolve,
      );
    }),
  setItem: async (key, value) => {
    chrome.runtime.sendMessage({
      channel,
      data: { method: 'set', key, value },
    });
    return Promise.resolve();
  },
  removeItem: async key => {
    chrome.runtime.sendMessage({ channel, data: { method: 'delete', key } });
    return Promise.resolve();
  },
  clear: async () => {
    chrome.runtime.sendMessage({ channel, data: { method: 'clear' } });
    return Promise.resolve();
  },
};

export default stash;
