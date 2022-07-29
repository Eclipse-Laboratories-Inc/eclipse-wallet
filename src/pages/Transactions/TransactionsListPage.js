import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import theme from '../../component-library/Global/theme';
import { TRANSACTION_TYPE, TYPES_MAP } from './constants';
import { cache, invalidate, CACHE_TYPES } from '../../utils/cache';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../../src/component-library/Global/GlobalButton';
import GlobalImage from '../../../src/component-library/Global/GlobalImage';
import AvatarImage from '../../component-library/Image/AvatarImage';
import IconFailed from '../../assets/images/IconFailed.png';
import IconSuccess from '../../assets/images/IconSuccessGreen.png';

import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

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

const TransactionsListPage = () => {
  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });
  const [{ activeWallet, selectedEndpoints }] = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState({});
  const [lastTransaction, setLastTransaction] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.TRANSACTIONS,
          () => activeWallet.getRecentTransactions(),
        ),
      ]).then(([recTransactions]) => {
        setRecentTransactions(recTransactions);
        setLastTransaction(recTransactions.slice(-1).pop());
        setLoaded(true);
      });
    }
  }, [activeWallet, selectedEndpoints]);

  const onLoadMore = () => {
    Promise.resolve(
      activeWallet.getRecentTransactions(lastTransaction.signature),
    ).then(recTransactions => {
      invalidate(CACHE_TYPES.TRANSACTIONS);
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.TRANSACTIONS,
        () => recentTransactions.concat(recTransactions),
      );
      setLastTransaction(recTransactions.slice(-1).pop());
      setRecentTransactions(recentTransactions.concat(recTransactions));
      setLoaded(true);
    });
  };

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle title="Your Transactions" />

      <GlobalCollapse
        title="Recent Activity"
        titleStyle={styles.titleStyle}
        hideCollapse
        isOpen>
        {loaded
          ? recentTransactions?.map((transaction, i) => {
              switch (transaction.type) {
                case TRANSACTION_TYPE.TRANSFER:
                case TRANSACTION_TYPE.CREATE_ACCOUNT:
                case TRANSACTION_TYPE.CREATE:
                  const isReceive = transaction.transferType === 'received';
                  const isUnknown = !transaction.destination;
                  return (
                    <CardButtonTransaction
                      transaction={
                        isUnknown ? 'unknown' : isReceive ? 'received' : 'sent'
                      }
                      address={transaction.destination}
                      // percentage="+0000%"
                      actions={
                        transaction.error
                          ? [
                              <View style={styles.inline}>
                                <GlobalText
                                  key={'amount-action'}
                                  type="body2"
                                  color="negative">
                                  {`${'-'}${
                                    transaction.fee / 1000000000
                                  } SOL  `}
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
                      onPress={() => onDetail(i)}
                    />
                  );
                case TRANSACTION_TYPE.SWAP:
                  return (
                    <CardButtonTransaction
                      transaction="swap"
                      address={activeWallet.getReceiveAddress()}
                      // percentage="+0000%"
                      actions={
                        transaction.error
                          ? [
                              <View style={styles.inline}>
                                <GlobalText
                                  key={'amount-action'}
                                  type="body2"
                                  color="negative">
                                  {`${'-'}${
                                    transaction.fee / 1000000000
                                  } SOL  `}
                                </GlobalText>
                                <GlobalImage source={IconFailed} size="xxs" />
                              </View>,
                            ]
                          : [
                              <View style={styles.inline}>
                                <GlobalText
                                  key={'amount-action'}
                                  type="body2"
                                  color="positive">
                                  {`+${
                                    transaction.swapAmountIn /
                                    (transaction.tokenNameIn === 'SOL' ||
                                    !transaction.tokenNameIn
                                      ? 1000000000
                                      : 1000000)
                                  } ${transaction.tokenNameIn || 'SOL'} `}
                                </GlobalText>
                                <AvatarImage
                                  url={transaction.tokenLogoIn}
                                  size={18}
                                />
                              </View>,
                              <View style={styles.inline}>
                                <GlobalText
                                  key={'amount-action'}
                                  type="body2"
                                  color="negative">
                                  {`-${
                                    transaction.swapAmountOut /
                                    (transaction.tokenNameOut === 'SOL' ||
                                    !transaction.tokenNameOut
                                      ? 1000000000
                                      : 1000000)
                                  } ${transaction.tokenNameOut || 'SOL'} `}
                                </GlobalText>
                                <AvatarImage
                                  url={transaction.tokenLogoOut}
                                  size={18}
                                />
                              </View>,
                            ].filter(Boolean)
                      }
                      onPress={() => onDetail(i)}
                    />
                  );
                case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                  return (
                    <CardButtonTransaction
                      transaction="interaction"
                      title={TYPES_MAP[transaction.type]}
                      // percentage="+0000%"
                      onPress={() => onDetail(i)}
                    />
                  );
              }
            })
          : null}

        {/*
        <CardButtonTransaction
          transaction="paid"
          address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
          amount="+5 SOL"
          percentage="+0000%"
          onPress={() => onDetail(1)}
        /> */}
        <GlobalButton type="text" title="Load more" onPress={onLoadMore} />
      </GlobalCollapse>
    </GlobalLayoutForTabScreen>
  );
};

export default TransactionsListPage;
