import React, { useEffect, useState } from 'react';
import GlobalCollapse from '../../../component-library/Global/GlobalCollapse';
import CardButtonTransaction from '../../../component-library/CardButton/CardButtonTransaction';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import { StyleSheet, View } from 'react-native';
import storage from '../../../utils/storage';
import STORAGE_KEYS from '../../../utils/storageKeys';
import { getTransactionImage } from '../../../utils/wallet';

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const PendingTxs = ({ activeWallet, translate }) => {
  const [transactions, setTransactions] = useState(null);
  useEffect(() => {
    const updateStatus = async txs => {
      const dateNow = new Date().getTime();
      await txs.forEach(async tx => {
        const { txId, lastStatus } = tx;
        const newCheck = lastStatus + 5 * 60 * 1000;
        if (newCheck < dateNow && tx.status === 'inProgress') {
          tx.lastStatus = dateNow;
          const { status } = await activeWallet.getTransaction(txId);
          if (status) {
            tx.status = status === 'completed' ? 'success' : 'fail';
          }
        }
      });
    };
    storage.getItem(STORAGE_KEYS.PENDING_TXS).then(async txs => {
      const dateNow = new Date().getTime();
      const nonExpiredTxs = txs.filter(tx => tx.expires > dateNow);
      setInterval(async () => {
        await updateStatus(nonExpiredTxs);
        setTransactions(nonExpiredTxs);
      }, 1000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (transactions) {
    storage.setItem(STORAGE_KEYS.PENDING_TXS, transactions);
  }

  return transactions && transactions.length > 0 ? (
    <>
      <GlobalCollapse
        title={translate('wallet.transactions_in_progress')}
        isOpen>
        {transactions.map((transaction, i) => {
          return (
            <CardButtonTransaction
              transaction={transaction.status}
              address={transaction.recipient}
              key={i}
              actions={
                <View style={{ alignItems: 'end' }}>
                  <GlobalText
                    key={'amount-action'}
                    type="body2"
                    color="primary">
                    {transaction.amount}
                  </GlobalText>
                  <View style={styles.inline}>
                    <GlobalImage
                      source={getTransactionImage(transaction.status)}
                      size={'xxs'}
                      circle
                      style={{ marginRight: 5 }}
                    />
                    <GlobalText
                      key={'amount-action'}
                      type="caption"
                      color="actionMsg">
                      {translate(`wallet.pending_txs.${transaction.status}`)}
                    </GlobalText>
                  </View>
                </View>
              }
            />
          );
        })}
      </GlobalCollapse>
    </>
  ) : null;
};
