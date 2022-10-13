/* global chrome */
const responseHandlers = new Map();

const launchPopup = (message, sender, sendResponse) => {
  const searchParams = new URLSearchParams();
  searchParams.set('origin', sender.origin);
  searchParams.set('network', message.data.params.network);
  searchParams.set('request', JSON.stringify(message.data));

  chrome.windows.getLastFocused(focusedWindow => {
    chrome.windows.create({
      url: 'index.html#' + searchParams.toString(),
      type: 'popup',
      width: 460,
      height: 675,
      top: focusedWindow.top,
      left: focusedWindow.left + (focusedWindow.width - 460),
      focused: true,
    });
  });

  responseHandlers.set(message.data.id, sendResponse);
};

const getConnection = (origin, { wallets, active }) => {
  if (!wallets || isNaN(active)) {
    return null;
  }
  const json = JSON.parse(wallets);
  if (!json.wallets || active < 0 || active >= json.wallets.length) {
    return null;
  }
  const wallet = json.wallets[active];
  if (wallet.chain !== 'SOLANA') {
    return null;
  }
  const { address } = wallet;
  const trustedApp = json?.config?.[address]?.trustedApps?.[origin];
  if (!trustedApp) {
    return null;
  }
  return { address };
};

const handleConnect = (message, sender, sendResponse) => {
  chrome.storage.local.get(['wallets', 'active'], result => {
    const connection = getConnection(sender.origin, result);
    if (connection) {
      sendResponse({
        method: 'connected',
        params: {
          publicKey: connection.address,
        },
        id: message.data.id,
      });
    } else {
      launchPopup(message, sender, sendResponse);
    }
  });
};

const handleDisconnect = (message, sender, sendResponse) => {
  sendResponse({ method: 'disconnected', id: message.data.id });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.channel === 'salmon_contentscript_background_channel') {
    if (message.data.method === 'connect') {
      handleConnect(message, sender, sendResponse);
    } else if (message.data.method === 'disconnect') {
      handleDisconnect(message, sender, sendResponse);
    } else {
      launchPopup(message, sender, sendResponse);
    }
    // keeps response channel open
    return true;
  } else if (message.channel === 'salmon_extension_background_channel') {
    const responseHandler = responseHandlers.get(message.data.id);
    responseHandlers.delete(message.data.id);
    responseHandler(message.data);
  }
});
