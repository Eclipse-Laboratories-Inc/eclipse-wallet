import React, { useCallback, useContext, useMemo } from 'react';

import { VersionedTransaction } from '@solana/web3.js';

import AdapterModule from '../../../native/AdapterModule';
import ApproveTransactionsForm from './ApproveTransactionsForm';
import { AppContext } from '../../../AppProvider';
import base58 from 'bs58';

const SignAndSendTransactionsForm = ({ request, name, icon, origin }) => {
  const [{ activeBlockchainAccount }] = useContext(AppContext);

  const payloads = useMemo(
    () =>
      request.payloads.map(payload =>
        // eslint-disable-next-line no-undef
        Buffer.from(payload, 'base64'),
      ),
    [request],
  );

  const onApprove = useCallback(async () => {
    const valid = payloads.map(() => true);

    const signedTransactions = payloads.map((payload, i) => {
      try {
        const transaction = VersionedTransaction.deserialize(payload);
        transaction.sign([activeBlockchainAccount.keyPair]);
        return transaction;
      } catch (e) {
        console.error(e);
        valid[i] = false;
      }
    });

    if (valid.every(Boolean)) {
      try {
        const connection = await activeBlockchainAccount.getConnection();

        const options = { minContextSlot: request.minContextSlot };

        const signedPayloads = await Promise.all(
          signedTransactions.map(async transaction => {
            const signature = await connection.sendTransaction(
              transaction,
              options,
            );
            // eslint-disable-next-line no-undef
            return Buffer.from(base58.decode(signature)).toString('base64');
          }),
        );

        AdapterModule.completeWithSignatures(signedPayloads);
      } catch (e) {
        console.error(e);

        const signedPayloads = signedTransactions.map(transaction =>
          // eslint-disable-next-line no-undef
          Buffer.from(transaction.signatures).toString('base64'),
        );

        AdapterModule.completeWithNotSubmitted(signedPayloads);
      }
    } else {
      AdapterModule.completeWithInvalidSignatures(valid);
    }
  }, [request, payloads, activeBlockchainAccount]);

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
