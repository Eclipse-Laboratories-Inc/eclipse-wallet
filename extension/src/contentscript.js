/* eslint-disable no-undef */
/* global chrome */

const scriptTag = document.createElement('script');
scriptTag.setAttribute('async', 'false');
scriptTag.src = chrome.runtime.getURL('script.js');

const container = document.head || document.documentElement;
container.insertBefore(scriptTag, container.children[0]);
container.removeChild(scriptTag);

window.addEventListener('salmon_injected_script_message', event => {
  chrome.runtime.sendMessage(
    {
      channel: 'salmon_contentscript_background_channel',
      data: event.detail,
    },
    response => {
      // Can return null response if window is killed
      if (!response) {
        return;
      }
      window.dispatchEvent(
        new CustomEvent('salmon_contentscript_message', { detail: response }),
      );
    },
  );
});
