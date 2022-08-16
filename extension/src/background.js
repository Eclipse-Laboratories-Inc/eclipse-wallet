/*global chrome*/
import METHODS from './../../src/rpc/methods';
import CHANNELS from './../../src/rpc/channels';

const responseHandlers = new Map();
let unlockedMnemonic = '';

const launchPopup = (message, sender, sendResponse) => {
  const searchParams = new URLSearchParams();
  searchParams.set('origin', sender.origin);
  searchParams.set('network', message.data.params.network);
  searchParams.set('request', JSON.stringify(message.data));

  // TODO consolidate popup dimensions
  chrome.windows.getLastFocused(focusedWindow => {
    chrome.windows.create({
      url: 'index.html#' + searchParams.toString(),
      type: 'popup',
      width: 450,
      height: 600,
      top: focusedWindow.top,
      left: focusedWindow.left + (focusedWindow.width - 450),
      setSelfAsOpener: true,
      focused: true,
    });
  });

  responseHandlers.set(message.data.id, sendResponse);
};

const handleConnect = (message, sender, sendResponse) => {
  chrome.storage.local.get('connectedWallets', result => {
    const connectedWallet = (result.connectedWallets || {})[sender.origin];
    if (!connectedWallet) {
      launchPopup(message, sender, sendResponse);
    } else {
      sendResponse({
        method: METHODS.CONNECTED,
        params: {
          publicKey: connectedWallet.publicKey,
          autoApprove: connectedWallet.autoApprove,
        },
        id: message.data.id,
      });
    }
  });
};

const handleDisconnect = (message, sender, sendResponse) => {
  chrome.storage.local.get('connectedWallets', result => {
    delete result.connectedWallets[sender.origin];
    chrome.storage.local.set(
      { connectedWallets: result.connectedWallets },
      () => sendResponse({ method: METHODS.DISCONNECTED, id: message.data.id }),
    );
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.channel) {
    case CHANNELS.content_script_background:
      switch (message.data.method) {
        case METHODS.CONNECT:
          handleDisconnect(message, sender, sendResponse);
          break;
        case METHODS.DISCONNECT:
          handleConnect(message, sender, sendResponse);
          break;
        default:
          launchPopup(message, sender, sendResponse);
          break;
      }
      break;
    case CHANNELS.extension_background:
      const responseHandler = responseHandlers.get(message.data.id);
      responseHandlers.delete(message.data.id);
      responseHandler(message.data);
      break;
    case CHANNELS.extension_mnemonic:
      switch (message.method) {
        case 'set':
          unlockedMnemonic = message.data;
          break;
        case 'get':
          sendResponse(unlockedMnemonic);
          break;
      }
      break;
  }
});
