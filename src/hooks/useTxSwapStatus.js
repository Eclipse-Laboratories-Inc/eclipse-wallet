import { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

const useTxSwapStatus = () => {
  const [setupTransaction, setSetupTransaction] = useState('');
  const [setupStatus, setSetupStatus] = useState(null);

  const [swapTransaction, setSwapTransaction] = useState('');
  const [swapStatus, setSwapStatus] = useState(null);

  const [cleanupTransaction, setCleanupTransaction] = useState('');
  const [cleanUpStatus, setCleanUpStatus] = useState(null);

  const [totalTransactions, setTotalTransactions] = useState('');
  const [currentTransaction, setCurrentTransaction] = useState(0);

  const sendTxListener = e => {
    switch (e.detail.name) {
      case 'setupTransaction':
        setSetupTransaction(e.detail.id);
        setSetupStatus(0);
        break;
      case 'swapTransaction':
        setSwapTransaction(e.detail.id);
        setSwapStatus(0);
        break;
      case 'cleanupTransaction':
        setCleanupTransaction(e.detail.id);
        setCleanUpStatus(0);
        break;
    }
    setTotalTransactions(totalTransactions + 1);
    console.info(
      `Transaction ${e.detail.name} with id ${e.detail.id} was submitted.`,
    );
  };

  const confirmSwapTxListener = e => {
    switch (e.detail.name) {
      case 'setupTransaction':
        setSetupStatus(1);
        break;
      case 'swapTransaction':
        setSwapStatus(1);
        break;
      case 'cleanupTransaction':
        setCleanUpStatus(1);
        break;
    }

    if (currentTransaction < totalTransactions) {
      setCurrentTransaction(currentTransaction + 1);
    }

    console.info(
      `Confirm transaction with id: ${e.detail.id} and status ${e.detail.status}`,
    );
  };

  const failSwapTxListener = e => {
    switch (e.detail.name) {
      case 'setupTransaction':
        setSetupStatus(2);
        break;
      case 'swapTransaction':
        setSwapStatus(2);
        break;
      case 'cleanupTransaction':
        setCleanUpStatus(2);
        break;
    }
    console.info(`Transaction ${e.detail.name} with id: ${e.detail.id} failed`);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('send_swap_tx', sendTxListener);
    DeviceEventEmitter.addListener('confirmed_swap_tx', confirmSwapTxListener);
    DeviceEventEmitter.addListener('failed_swap_tx', failSwapTxListener);

    return () => {
      DeviceEventEmitter.addListener('send_swap_tx', sendTxListener);
      DeviceEventEmitter.addListener(
        'confirmed_swap_tx',
        confirmSwapTxListener,
      );
      DeviceEventEmitter.addListener('failed_swap_tx', failSwapTxListener);
    };
  });

  return {
    setupTransaction,
    setupStatus,
    swapTransaction,
    swapStatus,
    cleanupTransaction,
    cleanUpStatus,
    totalTransactions,
    currentTransaction,
  };
};

export default useTxSwapStatus;
