import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigation, withParams } from '../../routes/hooks';
import { StyleSheet, View, Linking } from 'react-native';
import moment from 'moment';

import { AppContext } from '../../AppProvider';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { TRANSACTION_TYPE, TOKEN_DECIMALS } from './constants';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

import {
  LOGOS,
  getShortAddress,
  getTransactionImage,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import theme from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingTransactionBox: {
    marginVertical: theme.gutters.paddingXL,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  floatingTransactionBoxSwap: {
    marginVertical: theme.gutters.paddingXL,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  floatingTransaction: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  bigImage: {
    backgroundColor: theme.colors.bgLight,
  },
  inlineWell: {
    marginBottom: theme.gutters.paddingXS,
    paddingVertical: theme.gutters.paddingXS,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.buttonMaxWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusMD,
  },
});

const TransactionsDetailPage = ({ t, params }) => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);
  const [transactionDetail, setTransactionDetail] = useState({});
  const [loaded, setLoaded] = useState(false);

  const onBack = useCallback(
    () => navigate(ROUTES_MAP.TRANSACTIONS_LIST),
    [navigate],
  );

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.TRANSACTIONS,
          () => activeWallet.getRecentTransactions(),
        ),
      ]).then(([recentTransactions]) => {
        const txDetail = recentTransactions[params.id] || {};
        if (Object.keys(txDetail).length !== 0) {
          setTransactionDetail(txDetail || {});
          setLoaded(true);
        } else {
          onBack();
        }
      });
    }
  }, [activeWallet, onBack, params]);

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t('transactions.transaction_detail')}
        />
        {loaded ? (
          (() => {
            switch (transactionDetail.type) {
              case TRANSACTION_TYPE.TRANSFER:
              case TRANSACTION_TYPE.TRANSFER_CHECKED:
              case TRANSACTION_TYPE.GET_ACC_DATA:
              case TRANSACTION_TYPE.CREATE_ACCOUNT:
              case TRANSACTION_TYPE.CREATE:
              case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                const isReceive = transactionDetail.transferType === 'received';
                const isUnknown = !transactionDetail.destination;
                const isCreate = isUnknown && !transactionDetail.transferAmount;
                return (
                  <View style={styles.centered}>
                    <View style={styles.floatingTransactionBox}>
                      <GlobalImage
                        source={getMediaRemoteUrl(
                          isCreate
                            ? getTransactionImage('interaction')
                            : isUnknown
                            ? getTransactionImage('unknown')
                            : transactionDetail.nftAmount?.media ||
                              transactionDetail.transferLogoIn ||
                              transactionDetail.transferLogoOut ||
                              LOGOS.SOLANA,
                        )}
                        size="xxl"
                        style={styles.bigImage}
                        circle
                      />
                      <GlobalImage
                        source={
                          transactionDetail.error
                            ? getTransactionImage('fail')
                            : isReceive
                            ? getTransactionImage('received')
                            : getTransactionImage('sent')
                        }
                        size="md"
                        circle
                        style={styles.floatingTransaction}
                      />
                    </View>

                    {transactionDetail.nftAmount ? (
                      <GlobalText type="headline2" center>
                        {transactionDetail.error
                          ? `${'-'}${
                              transactionDetail.fee / TOKEN_DECIMALS.SOLANA
                            } SOL  `
                          : `${isReceive ? '+ 1 ' : '- 1 '} ${
                              transactionDetail.nftAmount?.collection?.name
                            }`}
                      </GlobalText>
                    ) : (transactionDetail.transferNameIn?.length ||
                        transactionDetail.transferNameOut?.length) &&
                      transactionDetail.transferAmount ? (
                      <GlobalText type="headline2" center>
                        {transactionDetail.error
                          ? `${'-'}${
                              transactionDetail.fee / TOKEN_DECIMALS.SOLANA
                            } SOL  `
                          : `${isReceive ? '+' : '-'} ${
                              transactionDetail.transferAmount
                            } ${
                              transactionDetail.transferNameIn ||
                              transactionDetail.transferNameOut
                            }
                          `}
                      </GlobalText>
                    ) : (
                      transactionDetail.amount && (
                        <GlobalText type="headline2" center>
                          {transactionDetail.error
                            ? `${'-'}${
                                transactionDetail.fee / TOKEN_DECIMALS.SOLANA
                              } SOL  `
                            : `${isReceive ? '+' : '-'}${
                                isReceive
                                  ? transactionDetail.amount
                                  : parseFloat(
                                      transactionDetail.amount +
                                        transactionDetail.fee /
                                          TOKEN_DECIMALS.SOLANA,
                                    ).toFixed(8)
                              } SOL`}
                        </GlobalText>
                      )
                    )}

                    <GlobalPadding size="sm" />

                    <View style={styles.inlineWell}>
                      <GlobalText type="caption" color="tertiary">
                        Date
                      </GlobalText>

                      <GlobalText type="body2">
                        {moment
                          .unix(transactionDetail.timestamp)
                          .format('MMM D, YYYY - h.mm A')}
                      </GlobalText>
                    </View>

                    <View style={styles.inlineWell}>
                      <GlobalText type="caption" color="tertiary">
                        Status
                      </GlobalText>

                      <GlobalText
                        type="body2"
                        color={
                          transactionDetail.error ? 'negative' : 'positive'
                        }>
                        {transactionDetail.error ? 'Failed' : 'Confirmed'}
                      </GlobalText>
                    </View>

                    {!isUnknown && (
                      <View style={styles.inlineWell}>
                        <GlobalText type="caption" color="tertiary">
                          To
                        </GlobalText>

                        <GlobalText type="body2" numberOfLines={1}>
                          {getShortAddress(transactionDetail.destination)}
                        </GlobalText>
                      </View>
                    )}

                    <GlobalPadding size="2xl" />

                    <GlobalButton
                      type="secondary"
                      wideSmall
                      title="GO TO SOLSCAN"
                      onPress={() =>
                        Linking.openURL(
                          `https://solscan.io/tx/${transactionDetail.signature}`,
                        )
                      }
                    />

                    <GlobalPadding />

                    <GlobalButton
                      type="primary"
                      wideSmall
                      title="Back to Wallet"
                      onPress={onBack}
                    />

                    <GlobalPadding size="xl" />
                  </View>
                );
              case TRANSACTION_TYPE.SWAP:
                return (
                  <View style={styles.centered}>
                    <View style={styles.floatingTransactionBoxSwap}>
                      {transactionDetail.error ? (
                        <GlobalImage
                          source={getTransactionImage('swap')}
                          size="xxl"
                          style={styles.bigImage}
                          circle
                        />
                      ) : (
                        <>
                          <GlobalImage
                            source={
                              transactionDetail.tokenLogoOut || LOGOS.SOLANA
                            }
                            size="xxl"
                            style={styles.bigImage}
                            circle
                          />
                          <GlobalImage
                            source={
                              transactionDetail.tokenLogoIn || LOGOS.SOLANA
                            }
                            size="xxl"
                            style={styles.bigImage}
                            circle
                          />
                        </>
                      )}
                      <GlobalImage
                        source={
                          transactionDetail.error
                            ? getTransactionImage('fail')
                            : getTransactionImage('swap')
                        }
                        size="md"
                        circle
                        style={styles.floatingTransaction}
                      />
                    </View>

                    {transactionDetail.error ? (
                      <GlobalText type="headline2" center>
                        {`${'-'}${
                          transactionDetail.fee / TOKEN_DECIMALS.SOLANA
                        } SOL  `}
                      </GlobalText>
                    ) : (
                      <>
                        <GlobalText type="headline2" center>
                          {`+${
                            transactionDetail.swapAmountIn /
                            (transactionDetail.tokenNameIn === 'SOL' ||
                            !transactionDetail.tokenNameIn
                              ? TOKEN_DECIMALS.SOLANA
                              : TOKEN_DECIMALS.COINS)
                          } ${transactionDetail.tokenNameIn || 'SOL'} `}
                        </GlobalText>
                        <GlobalText type="headline2" center>
                          {`-${
                            transactionDetail.swapAmountOut /
                            (transactionDetail.tokenNameOut === 'SOL' ||
                            !transactionDetail.tokenNameOut
                              ? TOKEN_DECIMALS.SOLANA
                              : TOKEN_DECIMALS.COINS)
                          } ${transactionDetail.tokenNameOut || 'SOL'} `}
                        </GlobalText>
                        <GlobalText type="headline2" center>
                          {`${'-'}${
                            transactionDetail.fee / TOKEN_DECIMALS.SOLANA
                          } SOL  `}
                        </GlobalText>
                      </>
                    )}

                    <GlobalPadding size="sm" />

                    <View style={styles.inlineWell}>
                      <GlobalText type="caption" color="tertiary">
                        Date
                      </GlobalText>

                      <GlobalText type="body2">
                        {moment
                          .unix(transactionDetail.timestamp)
                          .format('MMM D, YYYY - h.mm A')}
                      </GlobalText>
                    </View>

                    <View style={styles.inlineWell}>
                      <GlobalText type="caption" color="tertiary">
                        Status
                      </GlobalText>

                      <GlobalText
                        type="body2"
                        color={
                          transactionDetail.error ? 'negative' : 'positive'
                        }>
                        {transactionDetail.error ? 'Failed' : 'Confirmed'}
                      </GlobalText>
                    </View>

                    <View style={styles.inlineWell}>
                      <GlobalText type="caption" color="tertiary">
                        To
                      </GlobalText>

                      <GlobalText type="body2" numberOfLines={1}>
                        {getShortAddress(activeWallet.getReceiveAddress())}
                      </GlobalText>
                    </View>

                    <GlobalPadding size="2xl" />

                    <GlobalButton
                      type="secondary"
                      wideSmall
                      title="GO TO SOLSCAN"
                      onPress={() =>
                        Linking.openURL(
                          `https://solscan.io/tx/${transactionDetail.signature}`,
                        )
                      }
                    />

                    <GlobalPadding />

                    <GlobalButton
                      type="primary"
                      wideSmall
                      title="Back to Wallet"
                      onPress={onBack}
                    />

                    <GlobalPadding size="xl" />
                  </View>
                );
            }
          })()
        ) : (
          <GlobalSkeleton type="TransactionDetail" />
        )}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(TransactionsDetailPage));
