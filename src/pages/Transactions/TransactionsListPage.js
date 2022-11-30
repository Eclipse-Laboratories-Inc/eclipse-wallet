import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';

import { AppContext } from '../../AppProvider';
import { withTranslation } from '../../hooks/useTranslations';
import theme from '../../component-library/Global/theme';
import {
  TRANSACTION_TYPE,
  TYPES_MAP,
  TOKEN_DECIMALS,
  DEFAULT_SYMBOL,
} from './constants';
import { getWalletChain, getBlockchainIcon } from '../../utils/wallet';
import { cache, invalidate, CACHE_TYPES } from '../../utils/cache';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../../src/component-library/Global/GlobalButton';
import GlobalImage from '../../../src/component-library/Global/GlobalImage';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import IconFailed from '../../assets/images/IconFailed.png';
import IconSuccess from '../../assets/images/IconSuccessGreen.png';
import Header from '../../component-library/Layout/Header';

import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: theme.gutters.paddingNormal,
    marginLeft: theme.gutters.paddingSM,
    marginRight: theme.gutters.paddingSM,
  },
  dateStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
  dateStyleFirst: {
    marginBottom: theme.gutters.paddingSM,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyStyle: {
    marginTop: 10,
  },
});

const TransactionsListPage = ({ t }) => {
  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });
  const [{ activeWallet, selectedEndpoints, config }] = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState({});
  const [lastTransaction, setLastTransaction] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const current_blockchain = getWalletChain(activeWallet);

  useAnalyticsEventTracker(SECTIONS_MAP.TRANSACTIONS_LIST);

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
        setLastTransaction(recTransactions?.slice(-1).pop());
        setLoaded(true);
      });
    }
  }, [activeWallet, selectedEndpoints]);

  const onLoadMore = () => {
    setLoading(true);
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
      setLoading(false);
    });
  };

  const showDate = (recTrans, i) => {
    let lastTransDate;
    i === 0
      ? (lastTransDate = null)
      : (lastTransDate = moment
          .unix(recTrans[i - 1].timestamp)
          .format('MMM D, YYYY'));
    const thisTransDate = moment
      .unix(recTrans[i].timestamp)
      .format('MMM D, YYYY');
    const yesterday = moment().subtract(1, 'days').format('MMM D, YYYY');
    const today = moment().format('MMM D, YYYY');
    if (thisTransDate !== lastTransDate) {
      return thisTransDate === today
        ? t('transactions.today')
        : thisTransDate === yesterday
        ? t('transactions.yesterday')
        : thisTransDate;
    } else {
      return null;
    }
  };

  const showLoadMore = () =>
    recentTransactions?.length &&
    recentTransactions?.length % 8 === 0 &&
    loaded &&
    !loading;

  const Empty = () => (
    <GlobalText
      type="body2"
      color="primary"
      numberOfLines={1}
      center="true"
      style={styles.emptyStyle}>
      {t('transactions.empty')}
    </GlobalText>
  );

  return (
    <>
      <View style={styles.titleStyle}>
        <Header activeWallet={activeWallet} config={config} t={t} />
        <GlobalBackTitle title={t('transactions.your_transactions')} />
      </View>
      <GlobalLayout>
        <GlobalLayout.Header>
          <View>
            {loaded && recentTransactions?.length ? (
              recentTransactions?.map((transaction, i) => {
                switch (transaction.type) {
                  case TRANSACTION_TYPE.TRANSFER:
                  case TRANSACTION_TYPE.TRANSFER_NEAR:
                  case TRANSACTION_TYPE.TRANSFER_CHECKED:
                    const isReceive = transaction.transferType === 'received';
                    const isUnknown = !transaction.destination;
                    const isCreate = isUnknown && !transaction.amount;
                    return (
                      <View key={`transaction-${i}`}>
                        <GlobalText
                          type="body2"
                          color="secondary"
                          style={
                            i === 0 ? styles.dateStyleFirst : styles.dateStyle
                          }>
                          {showDate(recentTransactions, i)}
                        </GlobalText>
                        <CardButtonTransaction
                          transaction={
                            isUnknown
                              ? 'unknown'
                              : isReceive
                              ? 'received'
                              : 'sent'
                          }
                          tokenImg1={
                            transaction.transferLogoIn ||
                            transaction.transferLogoOut ||
                            transaction.nftAmount ||
                            (!transaction.error &&
                              getBlockchainIcon(current_blockchain))
                          }
                          title={isCreate && TYPES_MAP[transaction.type]}
                          address={
                            isReceive
                              ? transaction.source
                              : transaction.destination
                          }
                          // percentage="+0000%"
                          actions={
                            transaction.error
                              ? [
                                  <View style={styles.inline}>
                                    {!isReceive && (
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body2"
                                        color="negativeLight">
                                        {`${'-'}${
                                          transaction.fee /
                                          TOKEN_DECIMALS.SOLANA
                                        } SOL  `}
                                      </GlobalText>
                                    )}
                                    <GlobalImage
                                      source={IconFailed}
                                      size="xxs"
                                    />
                                  </View>,
                                ]
                              : transaction.nftAmount
                              ? [
                                  transaction.type !== 'create' && (
                                    <View style={styles.inline}>
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body1"
                                        color={
                                          isReceive
                                            ? 'positive'
                                            : 'negativeLight'
                                        }>
                                        {isReceive ? '+ 1 ' : '- 1 '}
                                        {`${transaction.nftAmount?.collection?.name} `}
                                      </GlobalText>
                                    </View>
                                  ),
                                ]
                              : (transaction.transferNameIn?.length ||
                                  transaction.transferNameOut?.length) &&
                                transaction.transferAmount
                              ? [
                                  <View style={styles.inline}>
                                    <GlobalText
                                      key={'amount-action'}
                                      type="body1"
                                      color={
                                        isReceive ? 'positive' : 'negativeLight'
                                      }>
                                      {isReceive ? '+' : '-'}
                                      {`${parseFloat(
                                        transaction.transferAmount.toFixed(4),
                                      )} `}
                                      {`${
                                        transaction.transferNameIn ||
                                        transaction.transferNameOut
                                      } `}
                                    </GlobalText>
                                  </View>,
                                ]
                              : [
                                  <View style={styles.inline}>
                                    {(transaction.amount ||
                                      transaction.transferAmount) && (
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body1"
                                        color={
                                          isReceive
                                            ? 'positive'
                                            : 'negativeLight'
                                        }>
                                        {isReceive ? '+' : '-'}
                                        {transaction.amount /
                                          TOKEN_DECIMALS[current_blockchain] ||
                                          transaction.transferAmount}
                                        {` ${DEFAULT_SYMBOL[current_blockchain]}`}
                                      </GlobalText>
                                    )}
                                  </View>,
                                ].filter(Boolean)
                          }
                          onPress={() => onDetail(i)}
                        />
                      </View>
                    );
                  // case TRANSACTION_TYPE.SWAP:
                  //   return (
                  //     <View key={`transaction-${i}`}>
                  //       <GlobalText
                  //         type="body2"
                  //         color="secondary"
                  //         style={
                  //           i === 0 ? styles.dateStyleFirst : styles.dateStyle
                  //         }>
                  //         {showDate(recentTransactions, i)}
                  //       </GlobalText>
                  //       <CardButtonTransaction
                  //         transaction="swap"
                  //         tokenImg1={
                  //           !transaction.error && transaction.tokenLogoIn
                  //         }
                  //         tokenImg2={
                  //           !transaction.error && transaction.tokenLogoOut
                  //         }
                  //         tokenNames={
                  //           !transaction.error &&
                  //           transaction.tokenNameIn &&
                  //           transaction.tokenNameOut
                  //             ? `${transaction.tokenNameIn} → ${transaction.tokenNameOut}
                  //               `
                  //             : 'Unknown'
                  //         }
                  //         // percentage="+0000%"
                  //         actions={
                  //           transaction.error
                  //             ? [
                  //                 <View style={styles.inline}>
                  //                   <GlobalText
                  //                     key={'amount-action'}
                  //                     type="body1"
                  //                     color="negativeLight">
                  //                     {`${'-'}${
                  //                       transaction.fee / TOKEN_DECIMALS.SOLANA
                  //                     } SOL  `}
                  //                   </GlobalText>
                  //                   <GlobalImage
                  //                     source={IconFailed}
                  //                     size="xxs"
                  //                   />
                  //                 </View>,
                  //               ]
                  //             : transaction.swapAmountIn !== '0' &&
                  //               [
                  //                 <View style={styles.inline}>
                  //                   <GlobalText
                  //                     key={'amount-action'}
                  //                     type="body1"
                  //                     color="positive">
                  //                     {`+${
                  //                       transaction.swapAmountIn /
                  //                       (transaction.tokenNameIn === 'SOL' ||
                  //                       !transaction.tokenNameIn
                  //                         ? TOKEN_DECIMALS.SOLANA
                  //                         : TOKEN_DECIMALS.COINS)
                  //                     } ${transaction.tokenNameIn || 'SOL'} `}
                  //                   </GlobalText>
                  //                 </View>,
                  //                 <View style={styles.inline}>
                  //                   {transaction.swapAmountOut && (
                  //                     <>
                  //                       <GlobalText
                  //                         key={'amount-action'}
                  //                         type="body1"
                  //                         color="negativeLight">
                  //                         {`-${
                  //                           transaction.swapAmountOut /
                  //                           (transaction.tokenNameOut ===
                  //                             'SOL' || !transaction.tokenNameOut
                  //                             ? TOKEN_DECIMALS.SOLANA
                  //                             : TOKEN_DECIMALS.COINS)
                  //                         } ${
                  //                           transaction.tokenNameOut || 'SOL'
                  //                         } `}
                  //                       </GlobalText>
                  //                     </>
                  //                   )}
                  //                 </View>,
                  //               ].filter(Boolean)
                  //         }
                  //         onPress={() => onDetail(i)}
                  //       />
                  //     </View>
                  //   );
                  // case TRANSACTION_TYPE.GET_ACC_DATA:
                  // case TRANSACTION_TYPE.CREATE_ACCOUNT:
                  // case TRANSACTION_TYPE.CREATE:
                  // case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                  //   return (
                  //     <View key={`transaction-${i}`}>
                  //       <GlobalText
                  //         type="body2"
                  //         color="secondary"
                  //         style={
                  //           i === 0 ? styles.dateStyleFirst : styles.dateStyle
                  //         }>
                  //         {showDate(recentTransactions, i)}
                  //       </GlobalText>
                  //       <CardButtonTransaction
                  //         transaction="interaction"
                  //         title={TYPES_MAP[transaction.type]}
                  //         actions={
                  //           transaction.error
                  //             ? [
                  //                 <View style={styles.inline}>
                  //                   <GlobalImage
                  //                     source={IconFailed}
                  //                     size="xxs"
                  //                   />
                  //                 </View>,
                  //               ]
                  //             : [
                  //                 <View style={styles.inline}>
                  //                   <GlobalImage
                  //                     source={IconSuccess}
                  //                     size="xxs"
                  //                   />
                  //                 </View>,
                  //               ].filter(Boolean)
                  //         }
                  //         onPress={() => onDetail(i)}
                  //       />
                  //     </View>
                  //   );
                }
              })
            ) : recentTransactions?.length === 0 ? (
              <Empty />
            ) : (
              <GlobalSkeleton type="ActivityList" />
            )}
            {loading && <GlobalSkeleton type="ActivityList" />}
            {/*
            <CardButtonTransaction
              transaction="paid"
              address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
              amount="+5 SOL"
              percentage="+0000%"
              onPress={() => onDetail(1)}
            /> */}
            {showLoadMore() ? (
              <GlobalButton
                type="text"
                title="Load more"
                onPress={onLoadMore}
              />
            ) : null}
          </View>
        </GlobalLayout.Header>
      </GlobalLayout>
    </>
  );
};

export default withTranslation()(TransactionsListPage);
