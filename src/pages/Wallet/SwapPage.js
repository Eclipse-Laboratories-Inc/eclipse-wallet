import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import get from 'lodash/get';
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
import { showPercentage, showValue } from '../../utils/amount';
import Header from '../../component-library/Layout/Header';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  viewTxLink: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.accentPrimary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
  creatingTx: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.labelSecondary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
});

const DetailItem = ({ title, value, t }) => (
  <View style={globalStyles.inlineWell}>
    <GlobalText type="caption" color="tertiary">
      {title}
    </GlobalText>

    <GlobalText type="body2">{value}</GlobalText>
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
  const [transaction, setTransaction] = useState('');
  const [status, setStatus] = useState();
  const [quoteCountdown, setQuoteCountdown] = useState(10);

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SWAP);

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
  useEffect(() => {
    const timer = setTimeout(function () {
      setQuoteCountdown(quoteCountdown - 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [quoteCountdown]);
  const getConfirmBtnTitle = () =>
    quoteCountdown >= 0
      ? `${t('general.confirm')} (${quoteCountdown})`
      : t('swap.refresh_quote');
  const getConfirmBtnAction = () => (quoteCountdown >= 0 ? onConfirm : onQuote);
  const validAmount =
    inToken &&
    parseFloat(inAmount) <= inToken.uiAmount &&
    parseFloat(inAmount) > 0;
  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };
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
      setQuoteCountdown(10);
      setProcessing(false);
      trackEvent({ action: EVENTS_MAP.SWAP_QUOTE });
      setStep(2);
    } catch (e) {
      setError(true);
      setProcessing(false);
    }
  };
  const onConfirm = async () => {
    setError(false);
    setProcessing(true);
    trackEvent({ action: EVENTS_MAP.SWAP_CONFIRMED });
    try {
      setStatus(TRANSACTION_STATUS.CREATING);
      setStep(3);
      const sts = await activeWallet.createSwapTransaction(quote.route.id);
      setTransaction(sts[0]);
      setStatus(TRANSACTION_STATUS.SWAPPING);

      for (let st of sts) {
        setTransaction(st);
        const result = await activeWallet.executeSwapTransaction(st);
        if (get(result, 'value.err')) {
          setError(true);
          trackEvent({ action: EVENTS_MAP.SWAP_FAILED });
          setStatus(TRANSACTION_STATUS.FAIL);
        } else {
          setError(false);
          trackEvent({ action: EVENTS_MAP.SWAP_COMPLETED });
          setStatus(TRANSACTION_STATUS.SUCCESS);
        }
      }

      setProcessing(false);
    } catch (e) {
      console.log(e);
      setError(true);
      setStatus(TRANSACTION_STATUS.FAIL);
      trackEvent({ action: EVENTS_MAP.SWAP_FAILED });
      setProcessing(false);
    }
  };
  const openTransaction = async () => {
    const url = `https://solscan.io/tx/${transaction}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
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
                />
                {!validAmount && !!inAmount && (
                  <GlobalText type="body1" center color="negative">
                    {t(`token.send.amount.invalid`, { max: inToken.uiAmount })}
                  </GlobalText>
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
            {quote &&
              quote.route &&
              quote.route.marketInfos.map(m => (
                <DetailItem
                  key={m.id}
                  title={m.label}
                  value={showPercentage(get(m, 'lpFee.pct'), 10)}
                />
              ))}
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
            <GlobalButton
              type="primary"
              flex
              title={getConfirmBtnTitle()}
              onPress={getConfirmBtnAction()}
              disabled={processing}
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 3 && (
        <>
          <GlobalLayout.Header>
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />

            {status !== 'success' && (
              <>
                <GlobalPadding size="4xl" />
                <GlobalPadding size="4xl" />
              </>
            )}
            <View style={globalStyles.centeredSmall}>
              <GlobalImage
                source={getTransactionImage(status)}
                size="3xl"
                circle
              />
              <GlobalPadding />
              {status !== 'creating' && (
                <GlobalText
                  type={status === 'swapping' ? 'subtitle2' : 'headline2'}
                  color={status === 'swapping' && 'secondary'}
                  center>
                  {t(`token.send.transaction_${status}`)}
                </GlobalText>
              )}
              {status === 'success' ||
                (status === 'fail' && (
                  <GlobalText type="body1" center>
                    3 lines max Excepteur sint occaecat cupidatat non proident,
                    sunt ?
                  </GlobalText>
                ))}

              <GlobalPadding size="4xl" />
            </View>
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            {status === 'success' || status === 'fail' ? (
              <>
                <GlobalButton
                  type="primary"
                  wide
                  title={t(`token.send.goto_explorer`)}
                  onPress={openTransaction}
                  style={globalStyles.button}
                  touchableStyles={globalStyles.buttonTouchable}
                />

                <GlobalPadding size="md" />

                <GlobalButton
                  type="secondary"
                  title={t(`general.close`)}
                  wide
                  onPress={goToBack}
                  style={globalStyles.button}
                  touchableStyles={globalStyles.buttonTouchable}
                />
              </>
            ) : (
              <GlobalButton
                type="text"
                wide
                textStyle={
                  status === 'creating' ? styles.creatingTx : styles.viewTxLink
                }
                title={
                  status === 'creating'
                    ? t(`token.send.transaction_creating`)
                    : t(`token.send.view_transaction`)
                }
                readonly={status === 'creating'}
                onPress={openTransaction}
              />
            )}
          </GlobalLayout.Footer>
        </>
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(SwapPage);
