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
  onError,
}) => {
  const [{ activeBlockchainAccount }] = useContext(AppContext);

  const payloads = useMemo(
    () => request.params.messages.map(bs58.decode),
    [request],
  );

  const createSignature = useCallback(
    payload => {
      const secretKey = bs58.decode(
        activeBlockchainAccount.retrieveSecurePrivateKey(),
      );
      return bs58.encode(nacl.sign.detached(payload, secretKey));
    },
    [activeBlockchainAccount],
  );

  const getMessage = useCallback(
    () => ({
      result: {
        signatures: payloads.map(createSignature),
        publicKey: activeBlockchainAccount.publicKey.toBase58(),
      },
      id: request.id,
    }),
    [request, activeBlockchainAccount, payloads, createSignature],
  );

  const onAccept = useCallback(() => {
    try {
      onApprove(getMessage());
    } catch (err) {
      onError(err.message);
    }
  }, [getMessage, onApprove, onError]);

  return (
    <ApproveTransactionsForm
      payloads={payloads}
      origin={origin}
      name={name}
      icon={icon}
      onApprove={onAccept}
      onReject={onReject}
    />
  );
};

export default SignTransactionsForm;
