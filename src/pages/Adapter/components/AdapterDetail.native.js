import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NativeEventEmitter } from 'react-native';

import GlobalSkeleton from '../../../component-library/Global/GlobalSkeleton';

import { AppContext } from '../../../AppProvider';
import AdapterModule from '../../../native/AdapterModule';
import ApproveConnectionForm from './ApproveConnectionForm';
import SignMessagesForm from './SignMessagesForm';
import SignTransactionsForm from './SignTransactionsForm';
import SignAndSendTransactionsForm from './SignAndSendTransactionsForm';

const AdapterDetail = () => {
  const [{ activeWallet }, { addTrustedApp }] = useContext(AppContext);

  const [request, setRequest] = useState(null);

  const origin = useMemo(() => request?.identityUri, [request]);
  const name = useMemo(() => request?.identityName, [request]);
  const icon = useMemo(
    () => request && `${request.identityUri}/${request.iconRelativeUri}`,
    [request],
  );
  const cluster = useMemo(() => request?.cluster, [request]);
  const address = useMemo(
    () => activeWallet.getReceiveAddress(),
    [activeWallet],
  );

  useEffect(() => {
    const emitter = new NativeEventEmitter(AdapterModule);
    const listener = emitter.addListener('onRequest', setRequest);
    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (cluster && activeWallet.networkId !== cluster) {
      activeWallet.setNetwork(cluster);
    }
  }, [activeWallet, cluster]);

  if (request?.type === 'AuthorizeRequest') {
    const onApprove = async () => {
      await addTrustedApp(address, origin, { name, icon });
    };

    const onReject = () => AdapterModule.completeWithDecline();

    return (
      <ApproveConnectionForm
        origin={origin}
        name={name}
        icon={icon}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  }

  if (request?.type === 'SignMessagesRequest') {
    return (
      <SignMessagesForm
        request={request}
        origin={origin}
        name={name}
        icon={icon}
      />
    );
  }

  if (request?.type === 'SignTransactionsRequest') {
    return (
      <SignTransactionsForm
        request={request}
        origin={origin}
        name={name}
        icon={icon}
      />
    );
  }

  if (request?.type === 'SignAndSendTransactionsRequest') {
    return (
      <SignAndSendTransactionsForm
        request={request}
        origin={origin}
        name={name}
        icon={icon}
      />
    );
  }

  return <GlobalSkeleton type="Generic" />;
};

export default AdapterDetail;
