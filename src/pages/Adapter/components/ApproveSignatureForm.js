/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, CardContent, CircularProgress } from '@mui/material';
import bs58 from 'bs58';
const { Message } = require('@solana/web3.js');

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';
import { globalStyles } from '../../../component-library/Global/theme';
import { getWalletName, getShortAddress } from '../../../utils/wallet';

import { withTranslation } from '../../../hooks/useTranslations';

import IconTransactionResultFail from '../../../assets/images/IconTransactionResultFail.png';
import { DAppCard } from './DAppCard';

const styles = StyleSheet.create({
  label: {
    marginRight: 5,
  },
  card: {
    width: '100%',
  },
  content: {
    paddingBottom: 0,
  },
  subcard: {
    padding: 4,
  },
});

function toHex(buffer) {
  return `0x${Array.prototype.map
    .call(buffer, x => ('00' + x.toString(16)).slice(-2))
    .join('')}`;
}

const SignMessageForm = ({ t, display, message }) => {
  return (
    <View>
      <GlobalText type="body1" color="secondary">
        {`${t('Message')}:`}
      </GlobalText>
      <GlobalPadding size="sm" />
      <Card sx={styles.card}>
        <CardContent>
          <GlobalText type="body1" color="primary" italic>
            {display === 'utf8'
              ? new TextDecoder('utf8').decode(message)
              : toHex(message)}
          </GlobalText>
        </CardContent>
      </Card>
    </View>
  );
};

const SignTransactionForm = ({ t, activeWallet, message }) => {
  const [differences, setDifferences] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [fee, setFee] = useState(null);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const connection = await activeWallet.getConnection();
        const { value } = await connection.getFeeForMessage(
          message,
          'confirmed',
        );
        setFee(value);
      } catch (e) {
        console.log(e);
        setFee(false);
      }
    };

    fetchFee();
  }, [activeWallet, message]);

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        const connection = await activeWallet.getConnection();
        const { value } = await connection.simulateTransaction(
          message,
          [activeWallet.keyPair],
          true,
        );

        const balances = await connection.getMultipleAccountsInfo(
          message.nonProgramIds(),
          'confirmed',
        );
        setSimulation(value);
        setDifferences(
          value.accounts.map(
            (account, i) => account.lamports - balances[i].lamports,
          ),
        );
      } catch (e) {
        console.log(e);
        setSimulation(false);
        setDifferences(false);
      }
    };

    fetchSimulation();
  }, [activeWallet, message]);

  const instructions = message.instructions || [];

  return (
    <Card sx={styles.card}>
      <CardContent style={styles.content}>
        <GlobalText type="subtitle3" style={styles.label} bold>
          {`${t('adapter.detail.signature.simulation')}:`}
        </GlobalText>
        <GlobalPadding size="sm" />
        {simulation === null && <CircularProgress size={24} />}
        {simulation === false && (
          <GlobalImage source={IconTransactionResultFail} size="md" />
        )}
        {simulation &&
          message
            .nonProgramIds()
            .map(key => key.toBase58())
            .map((key, j) => {
              const value = differences?.[j];
              let color;
              if (value < 0) {
                color = 'negative';
              } else if (value > 0) {
                color = 'positive';
              } else {
                color = 'secondary';
              }

              return (
                <View key={`simulation-${key}`}>
                  {j > 0 && <GlobalPadding size="md" />}
                  <GlobalText
                    type="overline"
                    style={styles.label}
                    uppercase
                    bold>
                    {key + ':'}
                  </GlobalText>
                  {differences && (
                    <GlobalText type="body1" color={color}>
                      {`${value > 0 ? '+' : ''}${value} lamports`}
                    </GlobalText>
                  )}
                </View>
              );
            })}
      </CardContent>
      {/*
      <CardContent style={styles.content}>
        <GlobalText type="caption" style={styles.label} uppercase bold>
          {`${t('adapter.detail.signature.instructions')}:`}
        </GlobalText>
        {instructions.map((instruction, i) => (
          <Card key={`instruction-${i}`}>
            <CardContent style={styles.subcard}>
              <GlobalText type="overline" style={styles.label} uppercase bold>
                {`${t('adapter.detail.signature.program')}:`}
              </GlobalText>
              <GlobalText type="overline" color="secondary">
                {message.accountKeys?.[instruction.programIdIndex]?.toBase58()}
              </GlobalText>
            </CardContent>
            {instruction.accounts?.map((account, j) => (
              <CardContent key={`account-${j}`} style={styles.subcard}>
                <GlobalText type="overline" style={styles.label} uppercase bold>
                  {`${t('adapter.detail.signature.account', {
                    number: j + 1,
                  })}:`}
                </GlobalText>
                <GlobalText type="overline" color="secondary">
                  {message.accountKeys?.[account]?.toBase58()}
                </GlobalText>
              </CardContent>
            ))}
            <CardContent style={styles.subcard}>
              <GlobalText type="overline" style={styles.label} uppercase bold>
                {`${t('adapter.detail.signature.data')}:`}
              </GlobalText>
              <GlobalText type="overline" color="secondary">
                {bs58.decode(instruction.data)}
              </GlobalText>
            </CardContent>
          </Card>
        ))}
      </CardContent>
      */}
      <CardContent style={styles.content}>
        <GlobalText type="subtitle3" style={styles.label} bold>
          {`${t('adapter.detail.signature.fee')}:`}
        </GlobalText>
        {fee === null && <CircularProgress size={12} />}
        {fee !== null && (
          <GlobalText type="caption" color="secondary">
            {isNaN(fee) ? '?' : `${fee} lamports`}
          </GlobalText>
        )}
      </CardContent>
      <GlobalPadding size="md" />
    </Card>
  );
};

const MessageForm = ({ t, activeWallet, request, message }) => {
  if (request.method === 'sign') {
    return (
      <SignMessageForm
        t={t}
        display={request.params.display}
        message={message}
      />
    );
  }
  return (
    <SignTransactionForm
      t={t}
      activeWallet={activeWallet}
      message={Message.from(message)}
    />
  );
};

const ApproveSignatureForm = ({
  t,
  activeWallet,
  origin,
  name,
  icon,
  request,
  messages,
  config,
  onApprove,
  onReject,
}) => {
  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalText color="primary">
          {getWalletName(activeWallet.getReceiveAddress(), config)}
        </GlobalText>
        <GlobalText type="caption">
          {getShortAddress(activeWallet.publicKey.toBase58())}
        </GlobalText>
        <GlobalPadding size="xl" />
        <GlobalBackTitle
          title={t(`adapter.detail.signature.${request.method}`)}
          nospace
        />
        <GlobalPadding size="xl" />
        <DAppCard name={name} icon={icon} origin={origin} />
        <GlobalPadding size="xl" />
        {messages.map((message, i) => (
          <MessageForm
            key={`message-${i}`}
            t={t}
            activeWallet={activeWallet}
            request={request}
            message={message}
          />
        ))}
        <GlobalPadding size="md" />
        <GlobalText type="subtitle" color="warning" center>
          {t('adapter.detail.signature.advice')}
        </GlobalText>
      </GlobalLayout.Header>
      <GlobalLayout.Footer>
        <View style={globalStyles.inlineFlexButtons}>
          <GlobalButton
            type="secondary"
            flex
            title={t('actions.cancel')}
            onPress={onReject}
            style={[globalStyles.button, globalStyles.buttonLeft]}
            touchableStyles={globalStyles.buttonTouchable}
          />
          <GlobalButton
            type="primary"
            flex
            title={t('actions.approve')}
            onPress={() => onApprove()}
            style={[globalStyles.button, globalStyles.buttonRight]}
            touchableStyles={globalStyles.buttonTouchable}
          />
        </View>
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(ApproveSignatureForm);
