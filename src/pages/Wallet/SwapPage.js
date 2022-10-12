import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import get from 'lodash/get';
import { getTokenByAddress } from '4m-wallet-adapter/services/solana/solana-token-list-service';
import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import InputWithTokenSelector from '../../features/InputTokenSelector';
import IconSwapAccent1 from '../../assets/images/IconSwapAccent1.png';
import {
  getAvailableTokens,
  getFeaturedTokens,
  getTransactionImage,
  TRANSACTION_STATUS,
} from '../../utils/wallet';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { getMediaRemoteUrl } from '../../utils/media';
import { showValue } from '../../utils/amount';
import Header from '../../component-library/Layout/Header';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';
import SwapAmounts from '../Transactions/SwapAmounts';

const styles = StyleSheet.create({
  viewTxLink: {
    fontFamily: theme.fonts.dmSansRegular,
    fontWeight: 'normal',
    textTransform: 'none',
  },
  creatingTx: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.labelSecondary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
  symbolContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  floatingSwap: {
    position: 'absolute',
    zIndex: 1,
    right: 55,
    bottom: -5,
  },
});

const DetailItem = ({ title, value, color = 'primary', t }) => (
  <View style={globalStyles.inlineWell}>
    <GlobalText type="caption" color={color}>
      {title}
    </GlobalText>

    <GlobalText type="body1">{value}</GlobalText>
  </View>
);

const RouteDetailItem = ({ names, symbols, t }) => (
  <View style={globalStyles.inlineWell}>
    <GlobalText type="caption" color="negativeLight">
      {t('swap.best_route')}
    </GlobalText>
    <View>
      <GlobalText type="body2">{names}</GlobalText>
      <GlobalText type="caption" color="tertiary">
        {`(${symbols})`}
      </GlobalText>
    </View>
  </View>
);

const BigDetailItem = ({ title, value, t }) => (
  <View
    style={[
      globalStyles.inlineWell,
      { flexDirection: 'column', alignItems: 'flex-start' },
    ]}>
    <GlobalText type="body1" color="secondary">
      {title}
    </GlobalText>

    <GlobalText type="headline2" nospace>
      {value}
    </GlobalText>
  </View>
);

const GlobalButtonTimer = React.memo(function ({
  onConfirm,
  onQuote,
  t,
  ...props
}) {
  const [countdown, setCountdown] = useState(10);
  const getConfirmBtnTitle = () =>
    countdown > 0
      ? `${t('general.confirm')} (${countdown})`
      : t('swap.refresh_quote');
  const getConfirmBtnAction = () => {
    if (countdown > 0) {
      return onConfirm();
    } else {
      setCountdown(10);
      return onQuote();
    }
  };
  useEffect(() => setCountdown(10), []);
  useEffect(() => {
    const timer =
      countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);
  return (
    <GlobalButton
      title={getConfirmBtnTitle()}
      onPress={getConfirmBtnAction}
      {...props}
    />
  );
});

const linkForTransaction = (title, id, status) => (
  <View style={globalStyles.inlineCentered}>
    <GlobalButton
      type="text"
      wide
      textStyle={styles.viewTxLink}
      title={title}
      readonly={false}
      onPress={() => openTransaction(id)}
    />
    {status === 0 && (
      <GlobalImage
        style={globalStyles.centeredSmall}
        source={getTransactionImage('swapping')}
        size="xs"
        circle
      />
    )}
    {status === 1 && (
      <GlobalImage
        style={globalStyles.centeredSmall}
        source={getTransactionImage('success')}
        size="xs"
        circle
      />
    )}
    {status === 2 && (
      <GlobalImage
        style={globalStyles.centeredSmall}
        source={getTransactionImage('fail')}
        size="xs"
        circle
      />
    )}
  </View>
);

const openTransaction = async tx => {
  const url = `https://solscan.io/tx/${tx}`;
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log(`UNSUPPORTED LINK ${url}`);
  }
};

const SwapPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeWallet, hiddenValue, config }] = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [tokens, setTokens] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [featuredTokens, setFeaturedTokens] = useState([]);
  const [inToken, setInToken] = useState(null);
  const [outToken, setOutToken] = useState(null);
  const [quote, setQuote] = useState({});
  const [status, setStatus] = useState();
  const [routesNames, setRoutesNames] = useState('');
  const [tokenSymbols, setTokenSymbols] = useState('');

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SWAP);

  const [setupTransaction, setSetupTransaction] = useState('');
  const [swapTransaction, setSwapTransaction] = useState('');
  const [cleanupTransaction, setCleanupTransaction] = useState('');
  const [setupStatus, setSetupStatus] = useState(null);
  const [swapStatus, setSwapStatus] = useState(null);
  const [cleanUpStatus, setCleanUpStatus] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentTransaction, setCurrentTransaction] = useState(1);

  useEffect(() => {
    document.addEventListener('send_swap_tx', e => {
      switch (e.detail.name) {
        case 'setupTransaction':
          setSetupTransaction(e.detail.id);
          setSetupStatus(0);
          break;
        case 'swapTransaction':
          setSwapTransaction(e.detail.id);
          setSwapStatus(0);
          break;
        case 'cleanupTransaction':
          setCleanupTransaction(e.detail.id);
          setCleanUpStatus(0);
          break;
      }
      setTotalTransactions(totalTransactions + 1);
      console.log(
        `Transaction ${e.detail.name} with id ${e.detail.id} was submitted.`,
      );
    });

    document.addEventListener('confirmed_swap_tx', e => {
      switch (e.detail.name) {
        case 'setupTransaction':
          setSetupStatus(1);
          break;
        case 'swapTransaction':
          setSwapStatus(1);
          break;
        case 'cleanupTransaction':
          setCleanUpStatus(1);
          break;
      }
      if (currentTransaction < totalTransactions)
        setCurrentTransaction(currentTransaction + 1);
      console.log(
        `Confirm transaction with id: ${e.detail.id} and status ${e.detail.status}`,
      );
    });

    document.addEventListener('failed_swap_tx', e => {
      switch (e.detail.name) {
        case 'setupTransaction':
          setSetupStatus(2);
          break;
        case 'swapTransaction':
          setSwapStatus(2);
          break;
        case 'cleanupTransaction':
          setCleanUpStatus(2);
          break;
      }
      console.log(
        `Transaction ${e.detail.name} with id: ${e.detail.id} failed`,
      );
    });
  });

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
        cache(`${activeWallet.chain}`, CACHE_TYPES.AVAILABLE_TOKENS, () =>
          getAvailableTokens(activeWallet.chain),
        ),
        cache(`${activeWallet.chain}`, CACHE_TYPES.FEATURED_TOKENS, () =>
          getFeaturedTokens(activeWallet.chain),
        ),
      ]).then(([balance, atks, ftks]) => {
        const tks = balance.items || [];
        setTokens(tks);
        setInToken(tks.length ? tks[0] : null);
        setAvailableTokens(atks);
        setFeaturedTokens(ftks);
        setReady(true);
      });
    }
  }, [activeWallet]);

  const [inAmount, setInAmount] = useState(null);
  const [outAmount, setOutAmount] = useState('--');
  useEffect(() => {
    setError(false);
  }, [inAmount, inToken, outToken]);
  const zeroAmount = inToken && parseFloat(inAmount) <= 0;
  const validAmount =
    inToken &&
    parseFloat(inAmount) <= inToken.uiAmount &&
    parseFloat(inAmount) > 0;
  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };
  const getRoutesSymbols = async routes => {
    const inputs = routes.map(
      async r =>
        await getTokenByAddress(r.inputMint).then(info => info[0].symbol),
    );
    const outputs = routes.map(
      async r =>
        await getTokenByAddress(r.outputMint).then(info => info[0].symbol),
    );
    const tokSymb = [...new Set([...inputs, ...outputs])];
    Promise.all(tokSymb).then(data => {
      setTokenSymbols([...new Set(data)].join(' → '));
    });
  };
  const getRoutesNames = routes =>
    setRoutesNames(routes.map(r => r.label).join(' x '));
  const onQuote = async () => {
    setError(false);
    setProcessing(true);
    try {
      const q = await activeWallet.getBestSwapQuote(
        inToken.mint || inToken.address,
        outToken.address,
        parseFloat(inAmount),
      );
      setQuote(q);
      getRoutesNames(q?.route?.marketInfos);
      await getRoutesSymbols(q?.route?.marketInfos);
      setProcessing(false);
      trackEvent(EVENTS_MAP.SWAP_QUOTE);
      setStep(2);
    } catch (e) {
      setError(true);
      setProcessing(false);
    }
  };
  const onConfirm = async () => {
    setError(false);
    setProcessing(true);
    trackEvent(EVENTS_MAP.SWAP_CONFIRMED);

    setStatus(TRANSACTION_STATUS.CREATING);
    setStep(3);
    activeWallet
      .createSwapTransaction(quote.route.id)
      .then(ids => {
        setError(false);
        trackEvent(EVENTS_MAP.SWAP_COMPLETED);
        setStatus(TRANSACTION_STATUS.SUCCESS);
        setProcessing(false);
      })
      .catch(ex => {
        console.error(ex.message);
        setError(true);
        trackEvent(EVENTS_MAP.SWAP_FAILED);
        setStatus(TRANSACTION_STATUS.FAIL);
        setProcessing(false);
      });

    setStatus(TRANSACTION_STATUS.SWAPPING);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'positive';
      case 'fail':
        return 'negative';
      default:
        return 'primary';
    }
  };

  return (
    <GlobalLayout>
      {step === 1 && (
        <>
          <GlobalLayout.Header>
            <Header activeWallet={activeWallet} config={config} t={t} />
            <GlobalBackTitle title={t('swap.swap_tokens')} />

            <GlobalPadding />
            {ready && tokens.length && (
              <>
                <View style={globalStyles.inlineFlexButtons}>
                  <GlobalText type="body2">{t('swap.you_send')}</GlobalText>
                  <GlobalText type="body1">
                    Max. {inToken.uiAmount} {inToken.symbol}
                  </GlobalText>
                </View>

                <GlobalPadding size="xs" />

                <InputWithTokenSelector
                  value={inAmount}
                  setValue={setInAmount}
                  placeholder={t('swap.enter_amount')}
                  title={inToken.symbol}
                  tokens={tokens}
                  hiddenValue={hiddenValue}
                  image={getMediaRemoteUrl(inToken.logo)}
                  onChange={setInToken}
                  invalid={!validAmount && !!inAmount}
                  number
                />
                {zeroAmount ? (
                  <GlobalText type="body1" center color="negative">
                    {t(`token.send.amount.invalid`)}
                  </GlobalText>
                ) : (
                  !validAmount &&
                  !!inAmount && (
                    <GlobalText type="body1" center color="negative">
                      {t(`token.send.amount.insufficient`, {
                        max: inToken.uiAmount,
                      })}
                    </GlobalText>
                  )
                )}
                <GlobalPadding size="xs" />

                <GlobalText type="body1" color="tertiary">
                  {showValue(inAmount * inToken.usdPrice, 6)} {t('general.usd')}
                </GlobalText>

                <GlobalPadding size="xs" />

                <View style={globalStyles.centered}>
                  <GlobalImage source={IconSwapAccent1} size="md" />
                </View>

                <GlobalPadding size="xs" />

                <GlobalText type="body2">{t('swap.you_receive')}</GlobalText>

                <GlobalPadding size="xs" />

                <InputWithTokenSelector
                  value={outAmount}
                  setValue={setOutAmount}
                  title={outToken ? outToken.symbol : '-'}
                  tokens={availableTokens}
                  featuredTokens={featuredTokens}
                  image={
                    outToken ? getMediaRemoteUrl(outToken.logo) : undefined
                  }
                  onChange={setOutToken}
                  disabled
                />

                <GlobalPadding size="xs" />

                {error && (
                  <GlobalText type="body1" color="negative">
                    {t('general.error')}
                  </GlobalText>
                )}
              </>
            )}
            {!ready && <GlobalSkeleton type="Swap" />}
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            <GlobalButton
              type="primary"
              wideSmall
              title={t('swap.quote')}
              disabled={!validAmount || !outToken || processing}
              onPress={onQuote}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 2 && (
        <>
          <GlobalLayout.Header>
            <GlobalBackTitle title={t('swap.swap_tokens')} />
            <GlobalPadding />
            <GlobalPadding size="xl" />
            <BigDetailItem
              title={t('swap.you_send')}
              value={`${get(quote, 'uiInfo.in.uiAmount')} ${get(
                quote,
                'uiInfo.in.symbol',
              )}`}
            />
            <BigDetailItem
              title={t('swap.you_receive')}
              value={`${get(quote, 'uiInfo.out.uiAmount')} ${get(
                quote,
                'uiInfo.out.symbol',
              )}`}
            />
            <GlobalPadding size="4xl" />
            {quote?.route?.marketInfos && (
              <RouteDetailItem
                names={routesNames}
                symbols={tokenSymbols}
                t={t}
              />
            )}
            {quote?.fee && (
              <DetailItem
                key={quote?.fee}
                title={t('swap.total_fee')}
                value={`${quote.fee.toFixed(8)} SOL`}
              />
            )}
          </GlobalLayout.Header>
          <GlobalLayout.Footer inlineFlex>
            <GlobalButton
              type="default"
              flex
              title={t('general.back')}
              onPress={() => setStep(1)}
              style={[globalStyles.button, globalStyles.buttonLeft]}
              touchableStyles={globalStyles.buttonTouchable}
            />
            <GlobalButtonTimer
              type="primary"
              flex
              disabled={processing}
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
              onConfirm={onConfirm}
              onQuote={onQuote}
              t={t}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 3 && (
        <>
          <GlobalLayout.Header>
            <GlobalPadding size="4xl" />
            <View style={globalStyles.centeredSmall}>
              <View style={styles.symbolContainer}>
                <GlobalImage source={inToken.logo} size="xl" circle />
                <GlobalImage
                  source={getTransactionImage('swap')}
                  style={styles.floatingSwap}
                  size="sm"
                  circle
                />
                <GlobalImage source={outToken.logo} size="xl" circle />
              </View>
              <GlobalPadding size="lg" />
              <View>
                <SwapAmounts
                  inAmount={quote.route.inAmount}
                  outAmount={quote.route.outAmount}
                  inToken={inToken.symbol}
                  outToken={outToken.symbol}
                />
              </View>
              <GlobalPadding size="xl" />
              {status !== 'creating' && (
                <GlobalText
                  type={'body2'}
                  color={getStatusColor(status)}
                  center>
                  {t(`token.send.transaction_${status}`)}
                </GlobalText>
              )}
              <GlobalPadding size="sm" />
              {setupTransaction &&
                linkForTransaction(
                  `Transaction ${currentTransaction} of ${totalTransactions}: Setup`,
                  setupTransaction,
                  setupStatus,
                )}
              {swapTransaction &&
                linkForTransaction(
                  `Transaction ${currentTransaction} of ${totalTransactions}: Swap`,
                  swapTransaction,
                  swapStatus,
                )}
              {cleanupTransaction &&
                linkForTransaction(
                  `Transaction ${currentTransaction} of ${totalTransactions}: Cleanup`,
                  cleanupTransaction,
                  cleanUpStatus,
                )}
              <GlobalPadding size="4xl" />
            </View>
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            {status === 'success' || status === 'fail' ? (
              <GlobalButton
                type="secondary"
                title={t(`general.close`)}
                wide
                onPress={goToBack}
                style={globalStyles.button}
                touchableStyles={globalStyles.buttonTouchable}
              />
            ) : (
              status === 'creating' && (
                <GlobalButton
                  type="text"
                  wide
                  textStyle={styles.creatingTx}
                  title={t(`token.send.transaction_creating`)}
                  readonly
                />
              )
            )}
          </GlobalLayout.Footer>
        </>
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(SwapPage);
