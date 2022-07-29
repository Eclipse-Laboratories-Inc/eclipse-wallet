/*global chrome*/

const scriptTag = document.createElement('script');
scriptTag.setAttribute('async', 'false');
scriptTag.src = chrome.runtime.getURL('script.js');

const container = document.head || document.documentElement;
container.insertBefore(scriptTag, container.children[0]);
container.removeChild(scriptTag);

import CHANNELS from './../../src/rpc/channels';

window.addEventListener('salmon_injected_script_message', event => {
  chrome.runtime.sendMessage(
    {
      channel: CHANNELS.content_script_background,
      data: event.detail,
    },
    response => {
      // Can return null response if window is killed
      if (!response) {
        return;
      }
      window.dispatchEvent(
        new window.CustomEvent('salmon_contentscript_message', {
          detail: response,
        }),
      );
    },
  );
});
