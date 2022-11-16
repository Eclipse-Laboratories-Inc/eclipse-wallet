import React, { useCallback, useContext, useMemo } from 'react';

import { VersionedTransaction } from '@solana/web3.js';

import AdapterModule from '../../../native/AdapterModule';
import ApproveTransactionsForm from './ApproveTransactionsForm';
import { AppContext } from '../../../AppProvider';
import base58 from 'bs58';

const SignAndSendTransactionsForm = ({ request, name, icon, origin }) => {
  const [{ activeWallet }] = useContext(AppContext);

  const options = useMemo(
    () => ({ minContextSlot: request.minContextSlot }),
    [request],
  );
  const payloads = useMemo(
    // eslint-disable-next-line no-undef
    () => request.payloads.map(payload => Buffer.from(payload, 'base64')),
    [request],
  );

  const createSignature = useCallback(
    async payload => {
      const transaction = VersionedTransaction.deserialize(payload);
      transaction.sign([activeWallet.keyPair]);
      const connection = await activeWallet.getConnection();
      return await connection.sendTransaction(transaction, options);
    },
    [activeWallet, options],
  );

  const onApprove = useCallback(async () => {
    const valid = payloads.map(() => true);

    const signedPayloads = await Promise.all(
      payloads.map(async (payload, i) => {
        try {
          const signature = await createSignature(payload);
          // eslint-disable-next-line no-undef
          const buffer = Buffer.concat([payload, base58.decode(signature)]);
          return buffer.toString('base64');
        } catch (e) {
          console.log(e);
          valid[i] = false;
        }
      }),
    );

    if (valid.every(Boolean)) {
      AdapterModule.completeWithSignatures(signedPayloads);
    } else {
      AdapterModule.completeWithInvalidSignatures(valid);
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
