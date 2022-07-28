import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import moment from 'moment';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { TRANSACTION_TYPE, TYPES_MAP } from './constants';
import { withTranslation } from '../../hooks/useTranslations';

import {
  LOGOS,
  getShortAddress,
  getTransactionImage,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
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

const TransactionsDetailPage = ({ params }) => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);
  const [transactionDetail, setTransactionDetail] = useState({});
  const [loaded, setLoaded] = useState(false);

  const onBack = () => navigate(ROUTES_MAP.TRANSACTIONS_LIST);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.TRANSACTIONS,
          () => activeWallet.getRecentTransactions(),
        ),
      ]).then(([recentTransactions]) => {
        const txDetail = recentTransactions[params.id] || [];
        setTransactionDetail(txDetail || {});
        setLoaded(true);
      });
    }
  }, [activeWallet, params]);

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={onBack} smallTitle="Transaction Detail" />
      {loaded &&
        (() => {
          switch (transactionDetail.type) {
            case TRANSACTION_TYPE.TRANSFER:
            case TRANSACTION_TYPE.CREATE_ACCOUNT:
            case TRANSACTION_TYPE.CREATE:
              const isReceive = transactionDetail.transferType === 'received';
              const isUnknown = !transactionDetail.destination;
              return (
                <View style={styles.centered}>
                  <View style={styles.floatingTransactionBox}>
                    <GlobalImage
                      source={getMediaRemoteUrl(
                        isUnknown
                          ? getTransactionImage('unknown')
                          : LOGOS.SOLANA,
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

                  {transactionDetail.amount && (
                    <GlobalText type="headline2" center>
                      {transactionDetail.error
                        ? `${transactionDetail.amount} SOL`
                        : `${isReceive ? '+' : '-'}${
                            transactionDetail.amount
                          } SOL`}
                    </GlobalText>
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
                      color={transactionDetail.error ? 'negative' : 'positive'}>
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
                    <GlobalImage
                      source={transactionDetail.tokenLogoOut}
                      size="xxl"
                      style={styles.bigImage}
                      circle
                    />
                    <GlobalImage
                      source={transactionDetail.tokenLogoIn}
                      size="xxl"
                      style={styles.bigImage}
                      circle
                    />
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

                  <GlobalText type="headline2" center>
                    {`+${
                      transactionDetail.swapAmountIn /
                      (transactionDetail.tokenNameIn === 'SOL'
                        ? 1000000000
                        : 1000000)
                    } ${transactionDetail.tokenNameIn} `}
                  </GlobalText>

                  <GlobalText type="headline2" center>
                    {`-${
                      transactionDetail.swapAmountOut /
                      (transactionDetail.tokenNameOut === 'SOL'
                        ? 1000000000
                        : 1000000)
                    } ${transactionDetail.tokenNameOut} `}
                  </GlobalText>

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
                      color={transactionDetail.error ? 'negative' : 'positive'}>
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
            case TRANSACTION_TYPE.CLOSE_ACCOUNT:
              return (
                <View style={styles.centered}>
                  <View style={styles.floatingTransactionBox}>
                    <GlobalImage
                      source={getTransactionImage('interaction')}
                      size="xxl"
                      style={styles.bigImage}
                      circle
                    />
                    <GlobalImage
                      source={
                        transactionDetail.error
                          ? getTransactionImage('fail')
                          : getTransactionImage('success')
                      }
                      size="md"
                      circle
                      style={styles.floatingTransaction}
                    />
                  </View>

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
                      color={transactionDetail.error ? 'negative' : 'positive'}>
                      {transactionDetail.error ? 'Failed' : 'Confirmed'}
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
        })()}
    </GlobalLayoutForTabScreen>
  );
};

export default withParams(withTranslation()(TransactionsDetailPage));
