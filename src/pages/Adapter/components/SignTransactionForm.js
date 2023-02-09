import React, { useCallback, useContext, useMemo } from 'react';

import bs58 from 'bs58';
import nacl from 'tweetnacl';

import { AppContext } from '../../../AppProvider';
import ApproveTransactionsForm from './ApproveTransactionsForm';

const SignTransactionForm = ({
  request,
  name,
  icon,
  origin,
  onApprove,
  onReject,
  onError,
}) => {
  const [{ activeBlockchainAccount }] = useContext(AppContext);

  const payload = useMemo(() => bs58.decode(request.params.message), [request]);

  const createSignature = useCallback(() => {
    const secretKey = bs58.decode(
      activeBlockchainAccount.retrieveSecurePrivateKey(),
    );
    return bs58.encode(nacl.sign.detached(payload, secretKey));
  }, [activeBlockchainAccount, payload]);

  const getMessage = useCallback(
    () => ({
      result: {
        signature: createSignature(),
        publicKey: activeBlockchainAccount.publicKey.toBase58(),
      },
      id: request.id,
    }),
    [request, activeBlockchainAccount, createSignature],
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
      payloads={[payload]}
      origin={origin}
      name={name}
      icon={icon}
      onApprove={onAccept}
      onReject={onReject}
    />
  );
};

export default SignTransactionForm;
