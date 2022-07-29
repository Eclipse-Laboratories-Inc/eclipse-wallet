import CHANNELS from './../../src/rpc/channels';

window.salmon = {
  postMessage: message => {
    const listener = event => {
      if (event.detail.id === message.id) {
        window.removeEventListener('salmon_contentscript_message', listener);
        window.postMessage(event.detail);
      }
    };
    window.addEventListener(CHANNELS.content_script_background, listener);

    window.dispatchEvent(
      new window.CustomEvent('salmon_injected_script_message', {
        detail: message,
      }),
    );
  },
};
