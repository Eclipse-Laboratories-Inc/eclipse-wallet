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
}) => {
  const [{ activeWallet }] = useContext(AppContext);

  const payload = useMemo(() => bs58.decode(request.params.message), [request]);

  const createSignature = useCallback(() => {
    const secretKey = bs58.decode(activeWallet.retrieveSecurePrivateKey());
    return bs58.encode(nacl.sign.detached(payload, secretKey));
  }, [activeWallet, payload]);

  const getMessage = useCallback(
    () => ({
      result: {
        signature: createSignature(),
        publicKey: activeWallet.publicKey.toBase58(),
      },
      id: request.id,
    }),
    [request, activeWallet, createSignature],
  );

  return (
    <ApproveTransactionsForm
      payloads={[payload]}
      origin={origin}
      name={name}
      icon={icon}
      onApprove={() => onApprove(getMessage())}
      onReject={onReject}
    />
  );
};

export default SignTransactionForm;
