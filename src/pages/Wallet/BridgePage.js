import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

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
import { getTransactionImage, TRANSACTION_STATUS } from '../../utils/wallet';
import { cache, CACHE_TYPES, invalidate } from '../../utils/cache';
import { getMediaRemoteUrl } from '../../utils/media';
import { showValue } from '../../utils/amount';
import Header from '../../component-library/Layout/Header';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import { getWalletChain, getBlockchainIcon } from '../../utils/wallet';
import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import useUserConfig from '../../hooks/useUserConfig';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import clipboard from '../../utils/clipboard.native';
import IconCopy from '../../assets/images/IconCopy.png';

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

const linkForTransaction = (title, id, status, explorer) => {
  const openTransaction = async tx => {
    const url = `${explorer.url}/tx/${tx}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  return (
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
};

const mergeStealthExTokenData = (bsupp, tks) => {
  const isMatch = (tok1, tok2) =>
    tok1.symbol.slice(0, 3) === tok2.symbol.toLowerCase().slice(0, 3);
  return bsupp
    .filter(el => {
      return tks.find(element => {
        return isMatch(el, element);
      });
    })
    .map(el => ({
      ...tks.find(element => isMatch(el, element)),
      ...el,
    }));
};

const BridgePage = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeWallet, hiddenValue, config }, { importTokens }] =
    useContext(AppContext);
  const [step, setStep] = useState(1);
  const [tokens, setTokens] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [featuredTokens, setFeaturedTokens] = useState([]);
  const [inToken, setInToken] = useState(null);
  const [outToken, setOutToken] = useState(null);
  const [exchangeDetails, setExchangeDetails] = useState(null);
  const [status, setStatus] = useState();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const [result, setResult] = useState(false);

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SWAP);
  const current_blockchain = getWalletChain(activeWallet);
  const { explorer } = useUserConfig(
    current_blockchain,
    activeWallet.networkId,
  );

  const tokensAddresses = useMemo(
    () =>
      Object.keys(
        get(config, `${activeWallet?.getReceiveAddress()}.tokens`, {}),
      ),
    [activeWallet, config],
  );

  useEffect(() => {
    if (activeWallet) {
      invalidate(CACHE_TYPES.AVAILABLE_TOKENS);
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(tokensAddresses),
        ),
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BRIDGE_SUPPORTED,
          () => activeWallet.getBridgeSupportedTokens(),
        ),
        activeWallet.getBridgeFeaturedTokens('sol'),
        activeWallet.getBridgeAvailableTokens('sol'),
      ]).then(([balance, bsupp, ftks, avtks]) => {
        const tks = balance.items || [];
        const tksSupp = mergeStealthExTokenData(bsupp, tks);
        setTokens(tksSupp);
        setInToken(tks.length ? tks[0] : null);
        setOutToken(ftks.length ? ftks[0] : null);
        setFeaturedTokens(ftks);
        setAvailableTokens(avtks);
        setReady(true);
      });
    }
  }, [activeWallet, tokensAddresses]);

  const [inAmount, setInAmount] = useState(null);

  const [outAmount, setOutAmount] = useState('--');

  const onChangeInToken = token => {
    setInToken(token);
    Promise.all([
      activeWallet.getBridgeFeaturedTokens(token.symbol.toLowerCase()),
      activeWallet.getBridgeAvailableTokens(token.symbol.toLowerCase()),
    ]).then(([ftks, avtks]) => {
      setFeaturedTokens(ftks);
      setAvailableTokens(avtks);
    });
  };

  const onRefreshEstimate = () => {
    if (Number(inAmount) > 0 && outToken) {
      Promise.resolve(
        activeWallet.getBridgeEstimatedAmount(
          inToken.symbol.toLowerCase(),
          outToken.symbol,
          inAmount,
        ),
      ).then(async estAmount => {
        setOutAmount(estAmount);
      });
    } else {
      setOutAmount('--');
    }
  };

  useEffect(() => {
    if (Number(inAmount) > 0 && outToken) {
      Promise.resolve(
        activeWallet.getBridgeEstimatedAmount(
          inToken.symbol.toLowerCase(),
          outToken.symbol,
          inAmount,
        ),
      ).then(async estAmount => {
        setOutAmount(estAmount);
      });
    } else {
      setOutAmount('--');
    }
  }, [activeWallet, inAmount, inToken, outToken]);

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

  const onQuote = async () => {
    setError(false);
    setProcessing(true);
    try {
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
      .createBridgeExchange(
        inToken.symbol.toLowerCase(),
        outToken.symbol,
        inAmount,
        recipientAddress,
      )
      .then(ex => {
        setError(false);
        trackEvent(EVENTS_MAP.SWAP_COMPLETED);
        setStatus(TRANSACTION_STATUS.SUCCESS);
        setProcessing(false);
        setExchangeDetails(ex);
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

  const validateAddress = useMemo(
    () =>
      debounce(async (a, regex) => {
        setCheckingAddress(true);
        setValidAddress(null);
        if (a) {
          const valid = new RegExp(regex).test(a);
          if (valid) {
            setCheckingAddress(false);
            setValidAddress(true);
            setAddressEmpty(true);
            setResult({ type: 'SUCCESS', code: 'VALID_ACCOUNT' });
          } else {
            setCheckingAddress(false);
            setValidAddress(false);
            setResult({ type: 'ERROR', code: 'ERROR' });
            console.log(error);
          }
        }
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeWallet],
  );
  useEffect(() => {
    setResult();
    if (recipientAddress) {
      validateAddress(recipientAddress, outToken.validation_address);
    } else {
      setValidAddress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientAddress]);

  console.log('ex', exchangeDetails);

  return (
    <GlobalLayout>
      {step === 1 && (
        <>
          <GlobalLayout.Header>
            <Header activeWallet={activeWallet} config={config} t={t} />
            <GlobalBackTitle title={t('actions.bridge')} />

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
                  title={inToken.symbol.toUpperCase()}
                  tokens={tokens}
                  hiddenValue={hiddenValue}
                  image={getMediaRemoteUrl(inToken.logo)}
                  onChange={onChangeInToken}
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

                <GlobalPadding size="md" />
                <GlobalText type="body2">{t('swap.you_receive')}</GlobalText>
                <GlobalPadding size="xs" />

                <InputWithTokenSelector
                  value={outAmount}
                  setValue={setOutAmount}
                  title={outToken ? outToken.symbol.toUpperCase() : '-'}
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
              title={t('actions.next')}
              disabled={!validAmount || !outToken || processing}
              onPress={onQuote}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 2 && (
        <>
          <GlobalLayout.Header>
            <GlobalBackTitle title={t('swap.swap_preview')} />
            <GlobalPadding />
            <BigDetailItem
              title={t('swap.you_send')}
              value={`${inAmount} ${inToken.symbol}`}
            />
            <BigDetailItem
              title={t('swap.you_receive')}
              value={`${outAmount} ${outToken.symbol}`}
            />
            <GlobalPadding size="2xl" />
            <GlobalInputWithButton
              startLabel={t('general.to')}
              placeholder={t('general.recipient_s_address', {
                token: outToken.symbol.toUpperCase(),
              })}
              value={recipientAddress}
              setValue={setRecipientAddress}
              onActionPress={() => {}}
              editable={!checkingAddress}
              validating={checkingAddress}
              complete={validAddress}
              inputStyle={
                result && result.type !== 'SUCCESS' ? styles[result.type] : {}
              }
            />
            {result && result.type !== 'SUCCESS' && (
              <>
                <GlobalPadding size="sm" />
                <GlobalText
                  type="body1"
                  center
                  color={result.type === 'ERROR' ? 'negative' : 'warning'}>
                  {t(`general.address_validation.${result.code}`)}
                </GlobalText>
              </>
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
              disabled={processing || !validAddress}
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
              onConfirm={onConfirm}
              onQuote={onRefreshEstimate}
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
                <GlobalImage
                  source={inToken.logo || getBlockchainIcon(current_blockchain)}
                  size="xl"
                  circle
                />
                <GlobalImage
                  source={getTransactionImage('swap')}
                  style={styles.floatingSwap}
                  size="sm"
                  circle
                />
                <GlobalImage
                  source={
                    outToken.logo || getBlockchainIcon(current_blockchain)
                  }
                  size="xl"
                  circle
                />
              </View>
              <GlobalPadding size="lg" />
              <View>
                {/* <SwapAmounts
                  inAmount={quote?.route?.inAmount || inAmount}
                  outAmount={
                    quote?.route?.outAmount ||
                    get(quote, 'uiInfo.out.uiAmount') ||
                    inAmount
                  }
                  inToken={inToken.symbol}
                  outToken={outToken.symbol}
                  blockchain={current_blockchain}
                /> */}
              </View>
              <GlobalPadding size="xl" />
              {/* {status !== 'creating' && (
                <GlobalText
                  type={'body2'}
                  color={getStatusColor(status)}
                  center>
                  {t(`token.send.transaction_${status}`)}
                </GlobalText>
              )}
              {status === 'swapping' && totalTransactions > 0 && (
                <GlobalText
                  type={'body1'}
                  color={getStatusColor(status)}
                  center>
                  {t(`token.send.swap_step`, {
                    current: currentTransaction,
                    total: totalTransactions,
                  })}
                </GlobalText>
              )} */}
              {exchangeDetails && (
                <>
                  <GlobalText
                    type={'body2'}
                    color={getStatusColor(status)}
                    center>
                    {t(
                      `You send ${
                        exchangeDetails?.expected_amount
                      } ${exchangeDetails?.currency_from?.toUpperCase()} to address: `,
                    )}
                  </GlobalText>
                  <GlobalPadding size="sm" />
                  <View style={globalStyles.inlineWell}>
                    <GlobalText type="caption">
                      {exchangeDetails?.address_from}
                    </GlobalText>

                    <GlobalButton
                      onPress={() =>
                        clipboard.copy(exchangeDetails?.address_from)
                      }
                      transparent>
                      <GlobalImage source={IconCopy} size="xs" />
                    </GlobalButton>
                  </View>
                </>
              )}
              <GlobalPadding size="sm" />
              {/* {linkForTransaction(
                `Transaction Swap`,
                currentTransaction.id,
                currentTransaction.status,
                explorer,
              )} */}
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

export default withTranslation()(BridgePage);
