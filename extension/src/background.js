/* global chrome */
const responseHandlers = new Map();
const stashedValues = new Map();

const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
};

const getConnectedTabsIds = () => 
  chrome.storage.local.get('connectedTabsIds').then(result => JSON.parse(result.connectedTabsIds || '[]'));

const updateConnectedTabsIds = async (tabId, action) => {
  const tabsIds = await getConnectedTabsIds();
  const updatedTabs = action === 'add' ? [...tabsIds, tabId] : tabsIds.filter(id => id !== tabId);
  chrome.storage.local.set({ connectedTabsIds: JSON.stringify(updatedTabs) });
};

const cleanConnectedTabs = async () => {
  const allTabIds = (await chrome.tabs.query({})).map(tab => tab.id);
  const connectedTabsIds = await getConnectedTabsIds();
  const validTabIds = connectedTabsIds.filter(id => allTabIds.includes(id));
  chrome.storage.local.set({ connectedTabsIds: JSON.stringify(validTabIds) });
};

const launchPopup = (message, sender, sendResponse) => {
  const { origin, data } = message;
  const searchParams = new URLSearchParams({ origin, request: JSON.stringify(data) });
  if (data.params?.network) searchParams.set('network', data.params.network);

  chrome.windows.getLastFocused(async (focusedWindow) => {
    const popup = await chrome.windows.create({
      url: `index.html#${searchParams.toString()}`,
      type: 'popup',
      width: 460,
      height: 675,
      top: focusedWindow.top,
      left: focusedWindow.left + (focusedWindow.width - 460),
      focused: true,
    });

    const listener = windowId => {
      if (windowId === popup.id) {
        responseHandlers.get(data.id)?.({ error: 'Operation cancelled', id: data.id });
        responseHandlers.delete(data.id);
        chrome.windows.onRemoved.removeListener(listener);
      }
    };

    chrome.windows.onRemoved.addListener(listener);
  });

  responseHandlers.set(data.id, sendResponse);
};

const getConnection = async (origin, { connection, networkId, trustedApps }) => {
  if (connection?.blockchain === 'solana' && networkId && trustedApps?.[networkId]?.[origin]) {
    return connection;
  }
  return null;
};

const handleConnect = async (message, sender, sendResponse) => {
  const tabId = await getActiveTabId();
  const callback = async (data) => {
    sendResponse(data);
    updateConnectedTabsIds(tabId, 'add');
  };

  chrome.storage.local.get(['connection', 'network_id', 'trusted_apps'], async result => {
    const connection = await getConnection(sender.origin, {
      connection: JSON.parse(result.connection || 'null'),
      networkId: JSON.parse(result.network_id || 'null'),
      trustedApps: JSON.parse(result.trusted_apps || 'null'),
    });

    if (connection) {
      callback({ method: 'connected', params: { publicKey: connection.address }, id: message.data.id });
    } else {
      launchPopup(message, sender, callback);
    }
  });
};

const handleDisconnect = async (message, sendResponse) => {
  sendResponse({ method: 'disconnected', id: message.data.id });
  const tabId = await getActiveTabId();
  updateConnectedTabsIds(tabId, 'remove');
};

const handleStashOperation = (message, sendResponse) => {
  const { method, key, value } = message.data;
  if (method === 'get') {
    sendResponse(stashedValues.get(key));
  } else if (method === 'set') {
    stashedValues.set(key, value);
    if (['password', 'active_at'].includes(key)) {
      chrome.alarms.create('salmon_lock_alarm', { delayInMinutes: 5 });
    }
  } else if (method === 'delete') {
    stashedValues.delete(key);
  } else if (method === 'clear') {
    stashedValues.clear();
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;

  const { channel, data } = message;
  if (channel === 'salmon_contentscript_background_channel') {
    if (data.method === 'connect') handleConnect(message, sender, sendResponse);
    else if (data.method === 'disconnect') handleDisconnect(message, sendResponse);
    else launchPopup(message, sender, sendResponse);
    return true; // Keeps response channel open
  } else if (channel === 'salmon_extension_background_channel') {
    responseHandlers.get(data.id)?.(data, data.id);
    responseHandlers.delete(data.id);
  } else if (channel === 'salmon_extension_stash_channel') {
    handleStashOperation(message, sendResponse);
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'salmon_lock_alarm') stashedValues.delete('password');
});

chrome.tabs.onRemoved.addListener(removeConnectedTabId);

cleanConnectedTabs();
