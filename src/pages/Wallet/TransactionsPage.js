import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { TRANSACTION_TYPE, TYPES_MAP } from './constants';
import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import { getShortAddress } from '../../utils/wallet';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../../src/component-library/Global/GlobalButton';
import GlobalImage from '../../../src/component-library/Global/GlobalImage';
import AvatarImage from '../../component-library/Image/AvatarImage';
import IconFailed from '../../assets/images/IconFailed.png';
import IconSuccess from '../../assets/images/IconSuccessGreen.png';

const styles = StyleSheet.create({
  titleStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const TransactionsPage = () => {
  const [{ activeWallet, selectedEndpoints }] = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState({});
  const [lastTransaction, setLastTransaction] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (activeWallet) {
      Promise.resolve(activeWallet.getRecentTransactions()).then(
        transactions => {
          setRecentTransactions(transactions);
          setLastTransaction(transactions.slice(-1).pop());
          setLoaded(true);
        },
      );
    }
  }, [activeWallet, selectedEndpoints]);

  const onLoadMore = () => {
    Promise.resolve(
      activeWallet.getRecentTransactions(lastTransaction.signature),
    ).then(transactions => {
      setLastTransaction(transactions.slice(-1).pop());
      setRecentTransactions(recentTransactions.concat(transactions));
      setLoaded(true);
    });
  };

  return (
    <GlobalLayoutForTabScreen>
      <GlobalText type="headline2" center>
        Your Transactions
      </GlobalText>

      <GlobalCollapse
        title="Recent Activity"
        titleStyle={styles.titleStyle}
        hideCollapse
        isOpen>
        {loaded &&
          recentTransactions?.map(transaction => {
            switch (transaction.type) {
              case TRANSACTION_TYPE.TRANSFER:
              case TRANSACTION_TYPE.CREATE_ACCOUNT:
              case TRANSACTION_TYPE.CREATE:
                const isReceive = transaction.transferType === 'received';
                const isUnknown = !transaction.destination;
                return (
                  <GlobalButtonCard
                    transaction={
                      isUnknown ? 'unknown' : isReceive ? 'received' : 'sent'
                    }
                    description={
                      transaction.destination &&
                      `To: ${getShortAddress(transaction.destination)}`
                    }
                    actions={
                      transaction.error
                        ? [
                            <View style={styles.inline}>
                              <GlobalText
                                key={'amount-action'}
                                type="body2"
                                color="negative">
                                {`${'-'}${transaction.fee / 1000000000} SOL  `}
                              </GlobalText>
                              <GlobalImage source={IconFailed} size="xxs" />
                            </View>,
                          ]
                        : [
                            <View style={styles.inline}>
                              <GlobalText
                                key={'amount-action'}
                                type="body2"
                                color={isReceive ? 'positive' : 'negative'}>
                                {isReceive ? '+' : '-'}
                                {isReceive
                                  ? transaction.amount
                                  : parseFloat(
                                      transaction.amount +
                                        transaction.fee / 1000000000,
                                    ).toFixed(8)}
                                {` SOL  `}
                              </GlobalText>
                              <GlobalImage source={IconSuccess} size="xxs" />
                            </View>,
                          ].filter(Boolean)
                    }
                    onPress={() => {}}
                  />
                );
              case TRANSACTION_TYPE.SWAP:
                return (
                  <GlobalButtonCard
                    transaction="swap"
                    description={`To: ${getShortAddress(
                      activeWallet.getReceiveAddress(),
                    )}`}
                    actions={[
                      <View style={styles.inline}>
                        <GlobalText
                          key={'amount-action'}
                          type="body2"
                          color="positive">
                          {`+${
                            transaction.swapAmountIn /
                            (transaction.tokenNameIn === 'SOL'
                              ? 1000000000
                              : 1000000)
                          } ${transaction.tokenNameIn} `}
                        </GlobalText>
                        <AvatarImage url={transaction.tokenLogoIn} size={18} />
                      </View>,
                      <View style={styles.inline}>
                        <GlobalText
                          key={'amount-action'}
                          type="body2"
                          color="negative">
                          {`-${
                            transaction.swapAmountOut /
                            (transaction.tokenNameOut === 'SOL'
                              ? 1000000000
                              : 1000000)
                          } ${transaction.tokenNameOut} `}
                        </GlobalText>
                        <AvatarImage url={transaction.tokenLogoOut} size={18} />
                      </View>,
                    ].filter(Boolean)}
                    onPress={() => {}}
                  />
                );
              case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                return (
                  <GlobalButtonCard
                    transaction="interaction"
                    title={TYPES_MAP[transaction.type]}
                    onPress={() => {}}
                  />
                );
            }
          })}

        {/*
        <GlobalButtonCard
          transaction="paid"
          description={`To: ${getShortAddress(
            'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
          )}`}
          actions={[
            <GlobalText key={'amount-action'} type="body2" color="positive">
              +1 SOL
            </GlobalText>,
            <GlobalText key={'perc-action'} type="caption" color="secondary">
              +0000%
            </GlobalText>,
          ].filter(Boolean)}
          onPress={() => {}}
        /> */}
        <GlobalButton type="text" title="Load more" onPress={onLoadMore} />
      </GlobalCollapse>
    </GlobalLayoutForTabScreen>
  );
};

export default TransactionsPage;
