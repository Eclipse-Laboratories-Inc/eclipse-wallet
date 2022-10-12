import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigation, withParams } from '../../routes/hooks';
import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { AppContext } from '../../AppProvider';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { TRANSACTION_TYPE, TOKEN_DECIMALS } from './constants';
import { ROUTES_MAP } from './routes';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';

import { withTranslation } from '../../hooks/useTranslations';

import {
  LOGOS,
  getShortAddress,
  getTransactionImage,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
import clipboard from '../../utils/clipboard';

import theme from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalToast from '../../component-library/Global/GlobalToast';
import IconCopy from '../../assets/images/IconCopy.png';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';
import SwapAmounts from './SwapAmounts';

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
  floatingSwap: {
    position: 'absolute',
    zIndex: 1,
    right: 55,
    bottom: -5,
  },
  addressCopyIcon: {
    marginLeft: theme.gutters.paddingXXS,
    marginBottom: -1,
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
  const [showToast, setShowToast] = useState(false);

  useAnalyticsEventTracker(SECTIONS_MAP.TRANSACTIONS_LIST);

  const onBack = useCallback(
    () => navigate(ROUTES_MAP.TRANSACTIONS_LIST),
    [navigate],
  );

  const goToWallet = () => navigate(APP_ROUTES_MAP.WALLET);

  const getTransactionTitle = type => {
    switch (type) {
      case 'sent':
        return 'Sent';
      case 'received':
        return 'Received';
      case 'swap':
        return 'Swap';
      case 'interaction':
        return 'Interaction';
      case 'paid':
        return 'Paid';
      case 'unknown':
        return 'Unknown';
      default:
        return 'Sent';
    }
  };

  const onCopyID = () => {
    clipboard.copy(transactionDetail.signature);
    setShowToast(true);
  };

  const onCopyAddress = isReceive => {
    clipboard.copy(
      isReceive ? transactionDetail.source : transactionDetail.destination,
    );
    setShowToast(true);
  };

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

  const TransferDetail = () => {
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

        {transactionDetail.nftAmount && transactionDetail.type !== 'create' ? (
          <GlobalText type="headline2" center>
            {!transactionDetail.error &&
              `${isReceive ? '+ 1 ' : '- 1 '} ${
                transactionDetail.nftAmount?.collection?.name
              }`}
          </GlobalText>
        ) : (transactionDetail.transferNameIn?.length ||
            transactionDetail.transferNameOut?.length) &&
          transactionDetail.transferAmount ? (
          <GlobalText type="headline2" center>
            {!transactionDetail.error &&
              `${isReceive ? '+' : '-'}${transactionDetail.transferAmount} ${
                transactionDetail.transferNameIn ||
                transactionDetail.transferNameOut
              }
            `}
          </GlobalText>
        ) : (
          transactionDetail.amount && (
            <GlobalText type="headline2" center>
              {!transactionDetail.error &&
                `${isReceive ? '+' : '-'}${
                  isReceive
                    ? transactionDetail.amount
                    : parseFloat(
                        transactionDetail.amount +
                          transactionDetail.fee / TOKEN_DECIMALS.SOLANA,
                      ).toFixed(8)
                } SOL`}
            </GlobalText>
          )
        )}

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
            Type
          </GlobalText>

          <GlobalText type="body2">
            {getTransactionTitle(
              isCreate
                ? 'interaction'
                : isUnknown
                ? 'unknown'
                : isReceive
                ? 'received'
                : 'sent',
            )}
          </GlobalText>
        </View>

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            Transaction ID
          </GlobalText>
          <TouchableOpacity onPress={onCopyID}>
            <GlobalText type="body2">
              {getShortAddress(transactionDetail.signature)}
              <GlobalImage
                source={IconCopy}
                style={styles.addressCopyIcon}
                size="xxs"
              />
            </GlobalText>
          </TouchableOpacity>
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
              {isReceive ? 'From' : 'To'}
            </GlobalText>
            <TouchableOpacity onPress={() => onCopyAddress(isReceive)}>
              <GlobalText type="body2">
                {isReceive
                  ? getShortAddress(transactionDetail.source)
                  : getShortAddress(transactionDetail.destination)}
                <GlobalImage
                  source={IconCopy}
                  style={styles.addressCopyIcon}
                  size="xxs"
                />
              </GlobalText>
            </TouchableOpacity>

            {/* <GlobalText type="body2" numberOfLines={1}>
              {getShortAddress(transactionDetail.destination)}
            </GlobalText> */}
          </View>
        )}

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            Fee
          </GlobalText>

          <GlobalText type="body2">
            {`${transactionDetail.fee / TOKEN_DECIMALS.SOLANA} SOL  `}
          </GlobalText>
        </View>

        <GlobalPadding size="2xl" />

        <GlobalButton
          type="secondary"
          wideSmall
          title={t(`token.send.goto_explorer`)}
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
          title={t(`transactions.detail_back`)}
          onPress={goToWallet}
        />

        <GlobalPadding size="xl" />
      </View>
    );
  };

  const InteractionDetail = () => {
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

        {transactionDetail.nftAmount && transactionDetail.type !== 'create' ? (
          <GlobalText type="headline2" center>
            {!transactionDetail.error &&
              `${isReceive ? '+ 1 ' : '- 1 '} ${
                transactionDetail.nftAmount?.collection?.name
              }`}
          </GlobalText>
        ) : (transactionDetail.transferNameIn?.length ||
            transactionDetail.transferNameOut?.length) &&
          transactionDetail.transferAmount ? (
          <GlobalText type="headline2" center>
            {!transactionDetail.error &&
              `${isReceive ? '+' : '-'}${transactionDetail.transferAmount} ${
                transactionDetail.transferNameIn ||
                transactionDetail.transferNameOut
              }
            `}
          </GlobalText>
        ) : (
          transactionDetail.amount && (
            <GlobalText type="headline2" center>
              {!transactionDetail.error &&
                `${isReceive ? '+' : '-'}${
                  isReceive
                    ? transactionDetail.amount
                    : parseFloat(
                        transactionDetail.amount +
                          transactionDetail.fee / TOKEN_DECIMALS.SOLANA,
                      ).toFixed(8)
                } SOL`}
            </GlobalText>
          )
        )}

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
            Type
          </GlobalText>

          <GlobalText type="body2">
            {getTransactionTitle('interaction')}
          </GlobalText>
        </View>

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            Transaction ID
          </GlobalText>
          <TouchableOpacity onPress={onCopyID}>
            <GlobalText type="body2">
              {getShortAddress(transactionDetail.signature)}
              <GlobalImage
                source={IconCopy}
                style={styles.addressCopyIcon}
                size="xxs"
              />
            </GlobalText>
          </TouchableOpacity>
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

        {transactionDetail.destination && (
          <View style={styles.inlineWell}>
            <GlobalText type="caption" color="tertiary">
              To
            </GlobalText>
            <TouchableOpacity onPress={() => onCopyAddress(isReceive)}>
              <GlobalText type="body2">
                {getShortAddress(transactionDetail.destination)}
                <GlobalImage
                  source={IconCopy}
                  style={styles.addressCopyIcon}
                  size="xxs"
                />
              </GlobalText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            Fee
          </GlobalText>

          <GlobalText type="body2">
            {`${transactionDetail.fee / TOKEN_DECIMALS.SOLANA} SOL  `}
          </GlobalText>
        </View>

        <GlobalPadding size="2xl" />

        <GlobalButton
          type="secondary"
          wideSmall
          title={t(`token.send.goto_explorer`)}
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
          title={t(`transactions.detail_back`)}
          onPress={goToWallet}
        />

        <GlobalPadding size="xl" />
      </View>
    );
  };

  const SwapDetail = () => (
    <View style={styles.centered}>
      <View style={styles.floatingTransactionBoxSwap}>
        {transactionDetail.error ? (
          <>
            <GlobalImage
              source={getTransactionImage('swap')}
              size="xxl"
              style={styles.bigImage}
              circle
            />
            <GlobalImage
              source={getTransactionImage('fail')}
              size="sm"
              style={styles.floatingTransaction}
            />
          </>
        ) : (
          <>
            <GlobalImage
              source={transactionDetail.tokenLogoOut || LOGOS.SOLANA}
              size="xl"
              style={styles.bigImage}
              circle
            />
            <GlobalImage
              source={getTransactionImage('swap')}
              size="sm"
              style={styles.floatingSwap}
            />
            <GlobalImage
              source={transactionDetail.tokenLogoIn || LOGOS.SOLANA}
              size="xl"
              style={styles.bigImage}
              circle
            />
          </>
        )}
      </View>

      {!transactionDetail.error && (
        <>
          <SwapAmounts
            inAmount={transactionDetail.swapAmountIn}
            outAmount={transactionDetail.swapAmountOut}
            inToken={transactionDetail.tokenNameIn}
            outToken={transactionDetail.tokenNameOut}
          />
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
          Type
        </GlobalText>

        <GlobalText type="body2">{getTransactionTitle('swap')}</GlobalText>
      </View>

      <View style={styles.inlineWell}>
        <GlobalText type="caption" color="tertiary">
          Transaction ID
        </GlobalText>
        <TouchableOpacity onPress={onCopyID}>
          <GlobalText type="body2">
            {getShortAddress(transactionDetail.signature)}
            <GlobalImage
              source={IconCopy}
              style={styles.addressCopyIcon}
              size="xxs"
            />
          </GlobalText>
        </TouchableOpacity>
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
          Fee
        </GlobalText>

        <GlobalText type="body2">
          {`${transactionDetail.fee / TOKEN_DECIMALS.SOLANA} SOL  `}
        </GlobalText>
      </View>

      <GlobalPadding size="2xl" />

      <GlobalButton
        type="secondary"
        wideSmall
        title={t(`token.send.goto_explorer`)}
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
        title={t(`transactions.detail_back`)}
        onPress={goToWallet}
      />

      <GlobalPadding size="xl" />
    </View>
  );

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t('transactions.transaction_detail')}
          nospace
        />
        {loaded ? (
          (() => {
            switch (transactionDetail.type) {
              case TRANSACTION_TYPE.SWAP:
                return <SwapDetail />;
              case TRANSACTION_TYPE.TRANSFER:
              case TRANSACTION_TYPE.TRANSFER_CHECKED:
                return <TransferDetail />;
              case TRANSACTION_TYPE.GET_ACC_DATA:
              case TRANSACTION_TYPE.CREATE_ACCOUNT:
              case TRANSACTION_TYPE.CREATE:
              case TRANSACTION_TYPE.CLOSE_ACCOUNT:
                return <InteractionDetail />;
            }
          })()
        ) : (
          <GlobalSkeleton type="TransactionDetail" />
        )}
      </GlobalLayout.Header>
      <GlobalToast
        message={t('wallet.copied')}
        open={showToast}
        setOpen={setShowToast}
      />
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(TransactionsDetailPage));
