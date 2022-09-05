import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import theme from '../../component-library/Global/theme';
import { TRANSACTION_TYPE, TYPES_MAP, TOKEN_DECIMALS } from './constants';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { LOGOS } from '../../utils/wallet';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
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

const TransactionsListComponent = ({ t }) => {
  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });
  const [{ activeWallet, selectedEndpoints }] = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState({});
  const [loaded, setLoaded] = useState(false);

  const onViewAll = () => navigate(ROUTES_MAP.TRANSACTIONS_LIST);

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
        setLoaded(true);
      });
    }
  }, [activeWallet, selectedEndpoints]);

  return (
    <GlobalCollapse
      title={t('transactions.recent_activity')}
      viewAllAction={onViewAll}
      titleStyle={styles.titleStyle}
      hideCollapse
      isOpen>
      {loaded ? (
        recentTransactions?.slice(0, 8).map((transaction, i) => {
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
                                color={isReceive ? 'positive' : 'negative'}>
                                {isReceive ? '+' : '-'}
                                {isReceive
                                  ? transaction.amount
                                  : parseFloat(
                                      transaction.amount +
                                        transaction.fee / TOKEN_DECIMALS.SOLANA,
                                    ).toFixed(8)}
                                {` SOL  `}
                              </GlobalText>
                            )}
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
                              url={transaction.tokenLogoIn || LOGOS.SOLANA}
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
                                  ? TOKEN_DECIMALS.SOLANA
                                  : TOKEN_DECIMALS.COINS)
                              } ${transaction.tokenNameOut || 'SOL'} `}
                            </GlobalText>
                            <AvatarImage
                              url={transaction.tokenLogoOut || LOGOS.SOLANA}
                              size={18}
                            />
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
              );
          }
        })
      ) : (
        <GlobalSkeleton type="ActivityList" />
      )}
    </GlobalCollapse>
  );
};

export default TransactionsListComponent;
