/* eslint-disable no-undef */

window.salmon = {
  postMessage: message => {
    const listener = event => {
      if (event.detail.id === message.id) {
        window.removeEventListener('salmon_contentscript_message', listener);
        window.postMessage(event.detail);
      }
    };
    window.addEventListener('salmon_contentscript_message', listener);

    window.dispatchEvent(
      new CustomEvent('salmon_injected_script_message', { detail: message }),
    );
  },
};
