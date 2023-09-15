import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getMetadata } from 'eclipse-wallet-adapter';

import GlobalSkeleton from '../../../component-library/Global/GlobalSkeleton';

import { AppContext } from '../../../AppProvider';
import ApproveConnectionForm from './ApproveConnectionForm';
import KeepOpenBanner from './KeepOpenBanner';
import SignAndSendTransactionsForm from './SignAndSendTransactionsForm';
import SignMessagesForm from './SignMessagesForm';
import SignTransactionsForm from './SignTransactionsForm';
import SignTransactionForm from './SignTransactionForm';
import { isExtension } from '../../../utils/platform';

const AUTHORIZED_METHODS = [
  'signTransaction',
  'signAllTransactions',
  'signAndSendTransaction',
  'sign',
];

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

const AdapterDetail = ({ networks }) => {
  const [
    { activeBlockchainAccount, activeTrustedApps, context, opener },
    { addTrustedApp, changeNetwork },
  ] = useContext(AppContext);
  const origin = useMemo(() => context.get('origin'), [context]);
  const environment = useMemo(() => context.get('network'), [context]);

  useEffect(() => {
    if (
      environment &&
      environment !== activeBlockchainAccount.network.environment
    ) {
      const isTarget = network => network.environment === environment;
      const network = networks.find(isTarget);
      if (network) {
        changeNetwork(network.id);
      }
    }
  }, [networks, activeBlockchainAccount, environment, changeNetwork]);

  const trustedApp = useMemo(
    () => activeTrustedApps[origin],
    [activeTrustedApps, origin],
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
      await addTrustedApp(origin, { name, icon });

      postMessage({
        method: 'connected',
        params: { publicKey: activeBlockchainAccount.getReceiveAddress() },
        id: isExtension() ? request.id : undefined,
      });
      if (isExtension()) {
        popRequest();
      } else {
        focusParent();
      }
    };

    const onReject = () => {
      postMessage({
        error: 'Connection cancelled',
        id: isExtension() ? request.id : undefined,
      });
      popRequest();

      window?.close();
    };

    return (
      <ApproveConnectionForm
        origin={origin}
        name={name}
        icon={icon}
        onApprove={connect}
        onReject={onReject}
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

  const onError = error => {
    popRequest();
    postMessage({
      error,
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
        onError={onError}
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
        onError={onError}
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
        onError={onError}
      />
    );
  }

  if (request?.method === 'signAndSendTransaction') {
    return (
      <SignAndSendTransactionsForm
        origin={origin}
        name={name}
        icon={icon}
        request={request}
        onApprove={onApprove}
        onReject={onReject}
        onError={onError}
      />
    );
  }

  if (isExtension() && requests.length === 0) {
    window.close();
  }

  return <GlobalSkeleton type="Generic" />;
};

export default AdapterDetail;
