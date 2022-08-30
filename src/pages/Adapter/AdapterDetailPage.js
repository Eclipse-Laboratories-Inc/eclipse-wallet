/* eslint-disable no-undef */
/* eslint-disable no-shadow */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import get from 'lodash/get';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { AppContext } from '../../AppProvider';

import ApproveConnectionForm from './components/ApproveConnectionForm';
import ApproveSignatureForm from './components/ApproveSignatureForm';
import KeepOpenBanner from './components/KeepOpenBanner';
import { getMetadata } from '../../utils/dapp';
import { isExtension } from '../../utils/platform';
import { getOpener } from '../../utils/runtime';

const AUTHORIZED_METHODS = ['signTransaction', 'signAllTransactions', 'sign'];

function getInitialRequests({ context }) {
  if (!isExtension()) {
    return [];
  }

  const request = JSON.parse(context.get('request'));

  if (!request) {
    return [];
  }

  if (request.method === 'sign') {
    const dataObj = request.params.data;
    // Deserialize `data` into a Uint8Array
    if (!dataObj) {
      throw new Error('Missing "data" params for "sign" request');
    }

    const data = new Uint8Array(Object.keys(dataObj).length);
    for (const [index, value] of Object.entries(dataObj)) {
      data[index] = value;
    }
    request.params.data = data;
  }

  return [request];
}

/**
 * Switch focus to the parent window. This requires that the parent runs
 * `window.name = 'parent'` before opening the popup.
 */
function focusParent() {
  try {
    window.open('', 'parent');
  } catch (err) {
    console.log(err);
  }
}

const AdapterDetailPage = () => {
  const [{ activeWallet, config, context }, { addTrustedApp }] =
    useContext(AppContext);
  const origin = useMemo(() => context.get('origin'), [context]);
  const opener = useMemo(() => getOpener(), []);

  const address = activeWallet.getReceiveAddress();
  const trustedApp = get(config, `${address}.trustedApps.${origin}`);

  const [connected, setConnected] = useState(isExtension() && !!trustedApp);
  const [loading, setLoading] = useState(!connected);
  const [name, setName] = useState(trustedApp?.name);
  const [icon, setIcon] = useState(trustedApp?.icon);
  const [autoApprove, setAutoApprove] = useState(!!trustedApp?.autoApprove);
  const [requests, setRequests] = useState(() =>
    getInitialRequests({ context }),
  );

  useEffect(() => {
    if (loading) {
      getMetadata(origin)
        .then(metadata => {
          setName(metadata?.name);
          setIcon(metadata?.icon);
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [loading, origin]);

  const postMessage = useCallback(
    message => {
      if (isExtension()) {
        chrome.runtime.sendMessage({
          channel: 'salmon_extension_background_channel',
          data: message,
        });
      } else {
        opener.postMessage({ jsonrpc: '2.0', ...message }, origin);
      }
    },
    [opener, origin],
  );

  // Send a disconnect event if this window is closed or this component is unmounted
  useEffect(() => {
    if (!isExtension()) {
      function unloadHandler() {
        setConnected(false);
        postMessage({ method: 'disconnected' });
      }
      window.addEventListener('beforeunload', unloadHandler);
      return () => {
        window.removeEventListener('beforeunload', unloadHandler);
      };
    }
  }, [postMessage]);

  // Push requests from the parent window into a queue.
  useEffect(() => {
    function messageHandler(e) {
      if (e.origin === origin && (e.source === opener || opener === null)) {
        if (!AUTHORIZED_METHODS.includes(e.data.method)) {
          postMessage({ error: 'Unsupported method', id: e.data.id });
        }

        setRequests(requests => [...requests, e.data]);
      }
    }
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [origin, opener, postMessage]);

  const request = requests[0];
  const popRequest = () => setRequests(requests => requests.slice(1));

  const messages = useMemo(() => {
    if (!request || request.method === 'connect') {
      return [];
    }
    switch (request.method) {
      case 'signTransaction':
        return [bs58.decode(request.params.message)];
      case 'signAllTransactions':
        return request.params.messages.map(m => bs58.decode(m));
      case 'sign':
        if (!(request.params.data instanceof Uint8Array)) {
          throw new Error('Data must be an instance of Uint8Array');
        }
        return [request.params.data];
      default:
        throw new Error('Unexpected method: ' + request.method);
    }
  }, [request]);

  if (loading) {
    return null;
  }

  if (connected && requests.length === 0) {
    if (isExtension()) {
      window.close();
    } else {
      focusParent();
    }

    return <KeepOpenBanner />;
  }

  if (
    (isExtension() && request?.method === 'connect') ||
    (!isExtension() && !connected)
  ) {
    // Approve the parent page to connect to this wallet.
    function connect(autoApprove) {
      setConnected(true);
      setAutoApprove(autoApprove);
      addTrustedApp(address, origin, { name, icon, autoApprove });

      postMessage({
        method: 'connected',
        params: { publicKey: activeWallet.publicKey.toBase58(), autoApprove },
        id: isExtension() ? request.id : undefined,
      });
      if (isExtension()) {
        popRequest();
      } else {
        focusParent();
      }
    }

    return (
      <ApproveConnectionForm
        origin={origin}
        name={name}
        icon={icon}
        wallet={activeWallet}
        config={config}
        onApprove={connect}
      />
    );
  }

  function createSignature(message) {
    const secretKey = bs58.decode(activeWallet.retrieveSecurePrivateKey());
    return bs58.encode(nacl.sign.detached(message, secretKey));
  }

  function sendSignature(message) {
    postMessage({
      result: {
        signature: createSignature(message),
        publicKey: activeWallet.publicKey.toBase58(),
      },
      id: request.id,
    });
  }

  function sendAllSignatures(messages) {
    postMessage({
      result: {
        signatures: messages.map(m => createSignature(m)),
        publicKey: activeWallet.publicKey.toBase58(),
      },
      id: request.id,
    });
  }

  function onApprove() {
    popRequest();
    switch (request.method) {
      case 'signTransaction':
      case 'sign':
        sendSignature(messages[0]);
        break;
      case 'signAllTransactions':
        sendAllSignatures(messages);
        break;
      default:
        throw new Error('Unexpected method: ' + request.method);
    }
  }

  function onReject() {
    popRequest();
    postMessage({
      error: 'Transaction cancelled',
      id: request.id,
    });
  }

  if (autoApprove) {
    onApprove();
    return null;
  }

  if (!request) {
    return null;
  }

  return (
    <ApproveSignatureForm
      key={request.id}
      activeWallet={activeWallet}
      origin={origin}
      name={name}
      icon={icon}
      request={request}
      messages={messages}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
};

export default AdapterDetailPage;
