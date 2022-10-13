import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import theme from '../../component-library/Global/theme';
import {
  TRANSACTION_TYPE,
  TYPES_MAP,
  TOKEN_DECIMALS,
  SOL_ICON,
} from './constants';
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
              const isReceive = transaction.transferType === 'received';
              const isUnknown = !transaction.destination;
              const isCreate = isUnknown && !transaction.amount;
              return (
                <CardButtonTransaction
                  transaction={
                    isUnknown ? 'unknown' : isReceive ? 'received' : 'sent'
                  }
                  tokenImg1={
                    transaction.transferLogoIn ||
                    transaction.transferLogoOut ||
                    transaction.nftAmount ||
                    (!transaction.error && SOL_ICON)
                  }
                  title={isCreate && TYPES_MAP[transaction.type]}
                  address={
                    isReceive ? transaction.source : transaction.destination
                  }
                  // percentage="+0000%"
                  actions={
                    transaction.error
                      ? [
                          <View style={styles.inline}>
                            {!isReceive && (
                              <GlobalText
                                key={'amount-action'}
                                type="body1"
                                color="negativeLight">
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
                          transaction.type !== 'create' && (
                            <View style={styles.inline}>
                              <GlobalText
                                key={'amount-action'}
                                type="body1"
                                color={
                                  isReceive ? 'positive' : 'negativeLight'
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
                              color={isReceive ? 'positive' : 'negativeLight'}>
                              {isReceive ? '+' : '-'}
                              {`${parseFloat(
                                transaction.transferAmount.toFixed(4),
                              )} `}
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
                            {(transaction.amount ||
                              transaction.transferAmount) && (
                              <GlobalText
                                key={'amount-action'}
                                type="body1"
                                color={
                                  isReceive ? 'positive' : 'negativeLight'
                                }>
                                {isReceive ? '+' : '-'}
                                {transaction.amount ||
                                  transaction.transferAmount}
                                {` SOL  `}
                              </GlobalText>
                            )}
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
                  tokenImg1={!transaction.error && transaction.tokenLogoIn}
                  tokenImg2={!transaction.error && transaction.tokenLogoOut}
                  tokenNames={
                    !transaction.error &&
                    transaction.tokenNameIn &&
                    transaction.tokenNameOut
                      ? `${transaction.tokenNameIn} → ${transaction.tokenNameOut}
                        `
                      : 'Unknown'
                  }
                  // percentage="+0000%"
                  actions={
                    transaction.error
                      ? [
                          <View style={styles.inline}>
                            <GlobalText
                              key={'amount-action'}
                              type="body1"
                              color="negativeLight">
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
                              type="body1"
                              color="positive">
                              {`+${
                                transaction.swapAmountIn /
                                (transaction.tokenNameIn === 'SOL' ||
                                !transaction.tokenNameIn
                                  ? TOKEN_DECIMALS.SOLANA
                                  : TOKEN_DECIMALS.COINS)
                              } ${transaction.tokenNameIn || 'SOL'} `}
                            </GlobalText>
                          </View>,
                          <View style={styles.inline}>
                            {transaction.swapAmountOut && (
                              <>
                                <GlobalText
                                  key={'amount-action'}
                                  type="body1"
                                  color="negativeLight">
                                  {`-${
                                    transaction.swapAmountOut /
                                    (transaction.tokenNameOut === 'SOL' ||
                                    !transaction.tokenNameOut
                                      ? TOKEN_DECIMALS.SOLANA
                                      : TOKEN_DECIMALS.COINS)
                                  } ${transaction.tokenNameOut || 'SOL'} `}
                                </GlobalText>
                              </>
                            )}
                          </View>,
                        ].filter(Boolean)
                  }
                  onPress={() => onDetail(i)}
                />
              );
            case TRANSACTION_TYPE.GET_ACC_DATA:
            case TRANSACTION_TYPE.CREATE_ACCOUNT:
            case TRANSACTION_TYPE.CREATE:
            case TRANSACTION_TYPE.CLOSE_ACCOUNT:
              return (
                <>
                  <CardButtonTransaction
                    transaction="interaction"
                    title={TYPES_MAP[transaction.type]}
                    actions={
                      transaction.error
                        ? [
                            <View style={styles.inline}>
                              <GlobalImage source={IconFailed} size="xxs" />
                            </View>,
                          ]
                        : [
                            <View style={styles.inline}>
                              <GlobalImage source={IconSuccess} size="xxs" />
                            </View>,
                          ].filter(Boolean)
                    }
                    onPress={() => onDetail(i)}
                  />
                </>
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
