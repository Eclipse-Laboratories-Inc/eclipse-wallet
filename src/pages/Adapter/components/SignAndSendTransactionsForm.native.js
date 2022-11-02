import React, { useCallback, useContext, useMemo } from 'react';

import bs58 from 'bs58';
import nacl from 'tweetnacl';

import AdapterModule from '../../../native/AdapterModule';
import ApproveTransactionsForm from './ApproveTransactionsForm';
import { AppContext } from '../../../AppProvider';

const SignAndSendTransactionsForm = ({ request, name, icon, origin }) => {
  const [{ activeWallet }] = useContext(AppContext);

  const payloads = useMemo(
    // eslint-disable-next-line no-undef
    () => request.payloads.map(payload => Buffer.from(payload, 'base64')),
    [request],
  );

  const createSignature = useCallback(
    payload => {
      const secretKey = bs58.decode(activeWallet.retrieveSecurePrivateKey());
      return nacl.sign.detached(payload, secretKey);
    },
    [activeWallet],
  );

  const onApprove = useCallback(() => {
    const valid = payloads.map(() => true);

    const signedPayloads = payloads.map((payload, i) => {
      try {
        // eslint-disable-next-line no-undef
        const buffer = Buffer.concat([payload, createSignature(payload)]);
        return buffer.toString('base64');
      } catch (e) {
        console.log(e);
        valid[i] = false;
      }
    });

    if (valid.every(Boolean)) {
      // TODO send transactions
      AdapterModule.completeWithSignedPayloads(signedPayloads);
    } else {
      AdapterModule.completeWithInvalidPayloads(valid);
    }
  }, [createSignature, payloads]);

  const onReject = () => AdapterModule.completeWithDecline();

  return (
    <ApproveTransactionsForm
      payloads={payloads}
      origin={origin}
      name={name}
      icon={icon}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
};

export default SignAndSendTransactionsForm;
