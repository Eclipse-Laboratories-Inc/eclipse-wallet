/* eslint-disable no-undef */
import React, { useCallback, useContext, useMemo } from 'react';

import bs58 from 'bs58';
import nacl from 'tweetnacl';

import ApproveMessagesForm from './ApproveMessagesForm';
import { AppContext } from '../../../AppProvider';

const toHex = buffer =>
  `0x${Array.prototype.map
    .call(buffer, x => ('00' + x.toString(16)).slice(-2))
    .join('')}`;

const SignMessagesForm = ({
  request,
  name,
  icon,
  origin,
  onApprove,
  onReject,
}) => {
  const [{ activeWallet }] = useContext(AppContext);

  const data = useMemo(() => {
    if (!(request.params.data instanceof Uint8Array)) {
      throw new Error('Data must be an instance of Uint8Array');
    }
    return request.params.data;
  }, [request]);

  const display = useMemo(() => request.params.display, [request]);

  const message = useMemo(
    () =>
      display === 'utf8' ? new TextDecoder('utf8').decode(data) : toHex(data),
    [display, data],
  );

  const createSignature = useCallback(() => {
    const secretKey = bs58.decode(activeWallet.retrieveSecurePrivateKey());
    return bs58.encode(nacl.sign.detached(data, secretKey));
  }, [activeWallet, data]);

  const getMessage = useCallback(
    () => ({
      result: {
        signature: createSignature(data),
        publicKey: activeWallet.publicKey.toBase58(),
      },
      id: request.id,
    }),
    [request, activeWallet, data, createSignature],
  );

  return (
    <ApproveMessagesForm
      messages={[message]}
      origin={origin}
      name={name}
      icon={icon}
      onApprove={() => onApprove(getMessage())}
      onReject={onReject}
    />
  );
};

export default SignMessagesForm;
