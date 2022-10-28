/* global chrome */
const responseHandlers = new Map();
const stashedValues = new Map();

const launchPopup = (message, sender, sendResponse) => {
  const searchParams = new URLSearchParams();
  searchParams.set('origin', sender.origin);
  searchParams.set('request', JSON.stringify(message.data));
  if (message.data.params.network) {
    searchParams.set('network', message.data.params.network);
  }

  chrome.windows.getLastFocused(async focusedWindow => {
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

const getConnection = async (origin, { wallets, active }) => {
  if (!wallets || isNaN(active)) {
    return null;
  }
  const json = JSON.parse(wallets);
  if (!json.wallets || active < 0 || active >= json.wallets.length) {
    return null;
  }
  let wallet;
  if (json.passwordRequired) {
    return null;
  } else {
    wallet = json.wallets[active];
  }
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
  chrome.storage.local.get(['wallets', 'active'], async result => {
    const connection = await getConnection(sender.origin, result);
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

const handleStashOperation = (message, sender, sendResponse) => {
  if (message.data.method === 'get') {
    sendResponse(stashedValues.get(message.data.key));
    return true;
  } else if (message.data.method === 'set') {
    stashedValues.set(message.data.key, message.data.value);
    if (['password', 'active_at'].includes(message.data.key)) {
      chrome.alarms.create('salmon_lock_alarm', { delayInMinutes: 5 });
    }
  } else if (message.data.method === 'delete') {
    stashedValues.delete(message.data.key);
  } else if (message.data.method === 'clear') {
    stashedValues.clear();
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) {
    return;
  }

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
  } else if (message.channel === 'sollet_extension_stash_channel') {
    handleStashOperation(message, sender, sendResponse);
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'salmon_lock_alarm') {
    stashedValues.delete('password');
  }
});
