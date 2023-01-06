import React, { useCallback, useContext, useMemo } from 'react';

import { VersionedTransaction } from '@solana/web3.js';

import AdapterModule from '../../../native/AdapterModule';
import ApproveTransactionsForm from './ApproveTransactionsForm';
import { AppContext } from '../../../AppProvider';
import { withTranslation } from '../../../hooks/useTranslations';

const SignTransactionsForm = ({ t, request, name, icon, origin }) => {
  const [{ activeWallet }] = useContext(AppContext);

  const payloads = useMemo(
    // eslint-disable-next-line no-undef
    () => request.payloads.map(payload => Buffer.from(payload, 'base64')),
    [request],
  );

  const createSignature = useCallback(
    payload => {
      const transaction = VersionedTransaction.deserialize(payload);
      transaction.sign([activeWallet.keyPair]);
      return transaction.serialize();
    },
    [activeWallet],
  );

  const onApprove = useCallback(() => {
    const valid = payloads.map(() => true);

    const signedPayloads = payloads.map((payload, i) => {
      try {
        // eslint-disable-next-line no-undef
        const buffer = Buffer.from(createSignature(payload));
        return buffer.toString('base64');
      } catch (e) {
        console.log(e);
        valid[i] = false;
      }
    });

    if (valid.every(Boolean)) {
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

export default withTranslation()(SignTransactionsForm);
