import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import get from 'lodash/get';

import GlobalSkeleton from '../../../component-library/Global/GlobalSkeleton';

import { AppContext } from '../../../AppProvider';
import ApproveConnectionForm from './ApproveConnectionForm';
import KeepOpenBanner from './KeepOpenBanner';
import SignMessagesForm from './SignMessagesForm';
import SignTransactionsForm from './SignTransactionsForm';
import SignTransactionForm from './SignTransactionForm';
import { getMetadata } from '../../../utils/dapp';
import { isExtension } from '../../../utils/platform';
import { getDefaultEndpoint } from '../../../utils/wallet';

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

const AdapterDetail = () => {
  const [{ activeWallet, config, context, opener }, { addTrustedApp }] =
    useContext(AppContext);
  const origin = useMemo(() => context.get('origin'), [context]);
  const endpoint = useMemo(
    () => context.get('network') || getDefaultEndpoint('SOLANA'),
    [context],
  );

  useEffect(() => {
    if (activeWallet.networkId !== endpoint) {
      activeWallet.setNetwork(endpoint);
    }
  }, [activeWallet, endpoint]);

  const address = useMemo(
    () => activeWallet.getReceiveAddress(),
    [activeWallet],
  );
  const trustedApp = useMemo(
    () => get(config, `${address}.trustedApps.${origin}`),
    [config, address, origin],
  );

  const [connected, setConnected] = useState(isExtension() && !!trustedApp);
  const [loading, setLoading] = useState(!connected);
  const [name, setName] = useState(trustedApp?.name);
  const [icon, setIcon] = useState(trustedApp?.icon);
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
        // eslint-disable-next-line no-undef
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

        setRequests(reqs => [...reqs, e.data]);
      }
    }
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [origin, opener, postMessage]);

  const request = useMemo(() => requests[0], [requests]);
  const popRequest = () => setRequests(reqs => reqs.slice(1));

  if (loading) {
    return <GlobalSkeleton type="Generic" />;
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
    const connect = async () => {
      setConnected(true);
      await addTrustedApp(address, origin, { name, icon });

      postMessage({
        method: 'connected',
        params: { publicKey: activeWallet.getReceiveAddress() },
        id: isExtension() ? request.id : undefined,
      });
      if (isExtension()) {
        popRequest();
      } else {
        focusParent();
      }
    };

    return (
      <ApproveConnectionForm
        origin={origin}
        name={name}
        icon={icon}
        onApprove={connect}
        onReject={() => window?.close()}
      />
    );
  }

  const onApprove = message => {
    popRequest();
    postMessage(message);
  };

  const onReject = () => {
    popRequest();
    postMessage({
      error: 'Transaction cancelled',
      id: request.id,
    });
  };

  if (request?.method === 'sign') {
    return (
      <SignMessagesForm
        origin={origin}
        name={name}
        icon={icon}
        request={request}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  }

  if (request?.method === 'signTransaction') {
    return (
      <SignTransactionForm
        origin={origin}
        name={name}
        icon={icon}
        request={request}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  }

  if (request?.method === 'signAllTransactions') {
    return (
      <SignTransactionsForm
        origin={origin}
        name={name}
        icon={icon}
        request={request}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  }

  if (isExtension() && requests.length === 0) {
    window.close();
  }

  return <GlobalSkeleton type="Generic" />;
};

export default AdapterDetail;
