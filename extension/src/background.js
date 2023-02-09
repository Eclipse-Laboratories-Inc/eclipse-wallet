/* global chrome */
const responseHandlers = new Map();
const stashedValues = new Map();

const getActiveTabId = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs?.[0]?.id;
};

const getConnectedTabsIds = async () =>
  new Promise(resolve => {
    chrome.storage.local.get('connectedTabsIds', result => {
      resolve(JSON.parse(result.connectedTabsIds || null) || []);
    });
  });

const addConnectedTabId = async tabId => {
  if (tabId) {
    const tabsIds = await getConnectedTabsIds();
    if (!tabsIds.includes(tabId)) {
      await chrome.storage.local.set({
        connectedTabsIds: JSON.stringify([...tabsIds, tabId]),
      });
    }
  }
};

const removeConnectedTabId = async tabId => {
  const tabsIds = await getConnectedTabsIds();
  if (tabsIds.includes(tabId)) {
    await chrome.storage.local.set({
      connectedTabsIds: JSON.stringify(tabsIds.filter(id => id !== tabId)),
    });
  }
};

const cleanConnectedTabs = async () => {
  const allTabsIds = (await chrome.tabs.query({})).map(tab => tab?.id);
  const connectedTabsIds = await getConnectedTabsIds();

  const tabsIds = connectedTabsIds.filter(tabId => allTabsIds.includes(tabId));
  await chrome.storage.local.set({
    connectedTabsIds: JSON.stringify(tabsIds),
  });
};

const launchPopup = (message, sender, sendResponse) => {
  const searchParams = new URLSearchParams();
  searchParams.set('origin', sender.origin);
  searchParams.set('request', JSON.stringify(message.data));
  if (message.data.params?.network) {
    searchParams.set('network', message.data.params.network);
  }

  chrome.windows.getLastFocused(async focusedWindow => {
    const popup = await chrome.windows.create({
      url: 'index.html#' + searchParams.toString(),
      type: 'popup',
      width: 460,
      height: 675,
      top: focusedWindow.top,
      left: focusedWindow.left + (focusedWindow.width - 460),
      focused: true,
    });

    const listener = windowId => {
      if (windowId === popup.id) {
        const responseHandler = responseHandlers.get(message.data.id);
        if (responseHandler) {
          responseHandlers.delete(message.data.id);
          responseHandler({
            error: 'Operation cancelled',
            id: message.data.id,
          });
        }

        chrome.windows.onRemoved.removeListener(listener);
      }
    };

    chrome.windows.onRemoved.addListener(listener);
  });

  responseHandlers.set(message.data.id, sendResponse);
};

const getConnection = async (
  origin,
  { connection, networkId, trustedApps },
) => {
  if (connection?.blockchain !== 'solana') {
    return null;
  }
  if (!networkId || !trustedApps?.[networkId]?.[origin]) {
    return null;
  }
  return connection;
};

const handleConnect = async (message, sender, sendResponse) => {
  chrome.storage.local.get(
    ['connection', 'network_id', 'trusted_apps'],
    async result => {
      const tabId = await getActiveTabId();

      const callback = async (data, id) => {
        await sendResponse(data, id);
        await addConnectedTabId(tabId);
      };

      const data = {
        connection: JSON.parse(result.connection || null),
        networkId: JSON.parse(result.network_id || null),
        trustedApps: JSON.parse(result.trusted_apps || null),
      };
      const connection = await getConnection(sender.origin, data);
      if (connection) {
        await callback({
          method: 'connected',
          params: {
            publicKey: connection.address,
          },
          id: message.data.id,
        });
      } else {
        launchPopup(message, sender, callback);
      }
    },
  );
};

const handleDisconnect = async (message, sender, sendResponse) => {
  await sendResponse({ method: 'disconnected', id: message.data.id });

  const tabId = await getActiveTabId();
  await removeConnectedTabId(tabId);
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
    responseHandler(message.data, message.data.id);
  } else if (message.channel === 'salmon_extension_stash_channel') {
    handleStashOperation(message, sender, sendResponse);
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'salmon_lock_alarm') {
    stashedValues.delete('password');
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  removeConnectedTabId(tabId);
});

cleanConnectedTabs();
