import React, { useEffect, useState } from 'react';
import GlobalCollapse from '../../../component-library/Global/GlobalCollapse';
import CardButtonTransaction from '../../../component-library/CardButton/CardButtonTransaction';
import GlobalText from '../../../component-library/Global/GlobalText';
import IconTransactionSending from '../../../assets/images/IconTransactionSending.gif';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import { StyleSheet, View } from 'react-native';
import storage from '../../../utils/storage';
import STORAGE_KEYS from '../../../utils/storageKeys';

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const PendingTxs = ({ translate }) => {
  const [transactions, setTransactions] = useState(null);
  useEffect(() => {
    storage.getItem(STORAGE_KEYS.PENDING_TXS).then(t => setTransactions(t));
  });

  return transactions && transactions.length > 0 ? (
    <>
      <GlobalCollapse
        title={translate('wallet.transactions_in_progress')}
        isOpen>
        {transactions.map((transaction, i) => {
          return (
            <CardButtonTransaction
              transaction="inProgress"
              address={transaction.recipient}
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
                      source={IconTransactionSending}
                      size={'xxs'}
                      circle
                      style={{ marginRight: 5 }}
                    />
                    <GlobalText
                      key={'amount-action'}
                      type="caption"
                      color="actionMsg">
                      In Progress
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
