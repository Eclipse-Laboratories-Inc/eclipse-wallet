import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import moment from 'moment';

import { AppContext } from '../../AppProvider';
import { withTranslation } from '../../hooks/useTranslations';
import theme from '../../component-library/Global/theme';
import { TRANSACTION_TYPE, TYPES_MAP, TOKEN_DECIMALS } from './constants';
import { cache, invalidate, CACHE_TYPES } from '../../utils/cache';
import { LOGOS } from '../../utils/wallet';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../../src/component-library/Global/GlobalButton';
import GlobalImage from '../../../src/component-library/Global/GlobalImage';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import AvatarImage from '../../component-library/Image/AvatarImage';
import IconFailed from '../../assets/images/IconFailed.png';
import IconSuccess from '../../assets/images/IconSuccessGreen.png';

import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: 15,
  },
  dateStyle: {
    lineHeight: theme.gutters.padding3XL,
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
  const [{ activeWallet, selectedEndpoints }] = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState({});
  const [lastTransaction, setLastTransaction] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <SafeAreaView edges={['top']} style={styles.titleStyle}>
        <GlobalBackTitle title={t('transactions.your_transactions')} />
      </SafeAreaView>
      <GlobalLayout>
        <View>
          {loaded && recentTransactions?.length ? (
            recentTransactions?.map((transaction, i) => {
              switch (transaction.type) {
                case TRANSACTION_TYPE.TRANSFER:
                case TRANSACTION_TYPE.TRANSFER_CHECKED:
                case TRANSACTION_TYPE.GET_ACC_DATA:
                case TRANSACTION_TYPE.CREATE_ACCOUNT:
                case TRANSACTION_TYPE.CREATE:
                case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                  const isReceive = transaction.transferType === 'received';
                  const isUnknown = !transaction.destination;
                  const isCreate = isUnknown && !transaction.amount;
                  return (
                    <>
                      <GlobalText
                        type="body2"
                        color="secondary"
                        style={styles.dateStyle}>
                        {showDate(recentTransactions, i)}
                      </GlobalText>
                      <CardButtonTransaction
                        transaction={
                          isCreate
                            ? 'interaction'
                            : isUnknown
                            ? 'unknown'
                            : isReceive
                            ? 'received'
                            : 'sent'
                        }
                        title={isCreate && TYPES_MAP[transaction.type]}
                        address={transaction.destination}
                        // percentage="+0000%"
                        actions={
                          transaction.error
                            ? [
                                <View style={styles.inline}>
                                  {!isReceive && (
                                    <GlobalText
                                      key={'amount-action'}
                                      type="body2"
                                      color="negative">
                                      {`${'-'}${
                                        transaction.fee / TOKEN_DECIMALS.SOLANA
                                      } SOL  `}
                                    </GlobalText>
                                  )}
                                  <GlobalImage source={IconFailed} size="xxs" />
                                </View>,
                              ]
                            : transaction.nftAmount
                            ? [
                                <View style={styles.inline}>
                                  <GlobalText
                                    key={'amount-action'}
                                    type="body2"
                                    color={isReceive ? 'positive' : 'negative'}>
                                    {isReceive ? '+ 1 ' : '- 1 '}
                                    {`${transaction.nftAmount?.collection?.name} `}
                                  </GlobalText>
                                  <AvatarImage
                                    url={transaction.nftAmount?.media}
                                    size={18}
                                  />
                                </View>,
                              ]
                            : (transaction.transferNameIn?.length ||
                                transaction.transferNameOut?.length) &&
                              transaction.transferAmount
                            ? [
                                <View style={styles.inline}>
                                  <GlobalText
                                    key={'amount-action'}
                                    type="body2"
                                    color={isReceive ? 'positive' : 'negative'}>
                                    {isReceive ? '+' : '-'}
                                    {`${transaction.transferAmount} `}
                                    {`${
                                      transaction.transferNameIn ||
                                      transaction.transferNameOut
                                    } `}
                                  </GlobalText>
                                  <AvatarImage
                                    url={
                                      transaction.transferLogoIn ||
                                      transaction.transferLogoOut
                                    }
                                    size={18}
                                  />
                                </View>,
                              ]
                            : [
                                <View style={styles.inline}>
                                  {transaction.amount && (
                                    <GlobalText
                                      key={'amount-action'}
                                      type="body2"
                                      color={
                                        isReceive ? 'positive' : 'negative'
                                      }>
                                      {isReceive ? '+' : '-'}
                                      {isReceive
                                        ? transaction.amount
                                        : parseFloat(
                                            transaction.amount +
                                              transaction.fee /
                                                TOKEN_DECIMALS.SOLANA,
                                          ).toFixed(8)}
                                      {` SOL  `}
                                    </GlobalText>
                                  )}
                                  <GlobalImage
                                    source={IconSuccess}
                                    size="xxs"
                                  />
                                </View>,
                              ].filter(Boolean)
                        }
                        onPress={() => onDetail(i)}
                      />
                    </>
                  );
                case TRANSACTION_TYPE.SWAP:
                  return (
                    <>
                      <GlobalText
                        type="body2"
                        color="secondary"
                        style={styles.dateStyle}>
                        {showDate(recentTransactions, i)}
                      </GlobalText>
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
                                      transaction.fee / TOKEN_DECIMALS.SOLANA
                                    } SOL  `}
                                  </GlobalText>
                                  <GlobalImage source={IconFailed} size="xxs" />
                                </View>,
                              ]
                            : transaction.swapAmountIn !== '0' &&
                              [
                                <View style={styles.inline}>
                                  <GlobalText
                                    key={'amount-action'}
                                    type="body2"
                                    color="positive">
                                    {`+${
                                      transaction.swapAmountIn /
                                      (transaction.tokenNameIn === 'SOL' ||
                                      !transaction.tokenNameIn
                                        ? TOKEN_DECIMALS.SOLANA
                                        : TOKEN_DECIMALS.COINS)
                                    } ${transaction.tokenNameIn || 'SOL'} `}
                                  </GlobalText>
                                  <AvatarImage
                                    url={
                                      transaction.tokenLogoIn || LOGOS.SOLANA
                                    }
                                    size={18}
                                  />
                                </View>,
                                <View style={styles.inline}>
                                  {transaction.swapAmountOut && (
                                    <>
                                      <GlobalText
                                        key={'amount-action'}
                                        type="body2"
                                        color="negative">
                                        {`-${
                                          transaction.swapAmountOut /
                                          (transaction.tokenNameOut === 'SOL' ||
                                          !transaction.tokenNameOut
                                            ? TOKEN_DECIMALS.SOLANA
                                            : TOKEN_DECIMALS.COINS)
                                        } ${
                                          transaction.tokenNameOut || 'SOL'
                                        } `}
                                      </GlobalText>
                                      <AvatarImage
                                        url={
                                          transaction.tokenLogoOut ||
                                          LOGOS.SOLANA
                                        }
                                        size={18}
                                      />
                                    </>
                                  )}
                                </View>,
                                <View style={styles.inline}>
                                  <GlobalText
                                    key={'amount-action'}
                                    type="body2"
                                    color="negative">
                                    {`${'-'}${
                                      transaction.fee / TOKEN_DECIMALS.SOLANA
                                    } SOL `}
                                  </GlobalText>
                                  <AvatarImage url={LOGOS.SOLANA} size={18} />
                                </View>,
                              ].filter(Boolean)
                        }
                        onPress={() => onDetail(i)}
                      />
                    </>
                  );
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
            <GlobalButton type="text" title="Load more" onPress={onLoadMore} />
          ) : null}
        </View>
      </GlobalLayout>
    </>
  );
};

export default withTranslation()(TransactionsListPage);
