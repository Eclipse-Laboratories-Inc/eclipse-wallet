import React, { useCallback, useContext, useMemo } from 'react';

import bs58 from 'bs58';
import nacl from 'tweetnacl';

import { AppContext } from '../../../AppProvider';
import ApproveTransactionsForm from './ApproveTransactionsForm';

const SignTransactionsForm = ({
  request,
  name,
  icon,
  origin,
  onApprove,
  onReject,
}) => {
  const [{ activeWallet }] = useContext(AppContext);

  const payloads = useMemo(
    () => request.params.messages.map(bs58.decode),
    [request],
  );

  const createSignature = useCallback(
    payload => {
      const secretKey = bs58.decode(activeWallet.retrieveSecurePrivateKey());
      return bs58.encode(nacl.sign.detached(payload, secretKey));
    },
    [activeWallet],
  );

  const getMessage = useCallback(
    () => ({
      result: {
        signatures: payloads.map(createSignature),
        publicKey: activeWallet.publicKey.toBase58(),
      },
      id: request.id,
    }),
    [request, activeWallet, payloads, createSignature],
  );

  return (
    <ApproveTransactionsForm
      payloads={payloads}
      origin={origin}
      name={name}
      icon={icon}
      onApprove={() => onApprove(getMessage())}
      onReject={onReject}
    />
  );
};

export default SignTransactionsForm;
