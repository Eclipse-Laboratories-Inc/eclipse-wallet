import React, { useCallback, useContext, useMemo } from 'react';

import bs58 from 'bs58';
import { VersionedMessage, VersionedTransaction } from '@solana/web3.js';

import { AppContext } from '../../../AppProvider';
import ApproveTransactionsForm from './ApproveTransactionsForm';

const SignAndSendTransactionForm = ({
  request,
  name,
  icon,
  origin,
  onApprove,
  onReject,
  onError,
}) => {
  const [{ activeWallet }] = useContext(AppContext);

  const payload = useMemo(() => bs58.decode(request.params.message), [request]);
  const options = useMemo(() => request.params.options, [request]);

  const createSignature = useCallback(async () => {
    const message = VersionedMessage.deserialize(payload);
    const transaction = new VersionedTransaction(message);
    transaction.sign([activeWallet.keyPair]);

    const connection = await activeWallet.getConnection();
    return connection.sendTransaction(transaction, options);
  }, [activeWallet, payload, options]);

  const getMessage = useCallback(
    async () => ({
      result: {
        signature: await createSignature(),
        publicKey: activeWallet.publicKey.toBase58(),
      },
      id: request.id,
    }),
    [request, activeWallet, createSignature],
  );

  const onAccept = useCallback(async () => {
    try {
      onApprove(await getMessage());
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

export default SignAndSendTransactionForm;
