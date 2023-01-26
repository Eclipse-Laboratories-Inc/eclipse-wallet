import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import pick from 'lodash/pick';

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
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import GlobalAlert from '../../component-library/Global/GlobalAlert';
import InputWithTokenSelector from '../../features/InputTokenSelector';
import { getTransactionImage, TRANSACTION_STATUS } from '../../utils/wallet';
import { cache, CACHE_TYPES, invalidate } from '../../utils/cache';
import { getMediaRemoteUrl } from '../../utils/media';
import { showValue } from '../../utils/amount';
import Header from '../../component-library/Layout/Header';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import BasicRadios from '../../component-library/Radios/BasicRadios';
import IconSwapAccent1 from '../../assets/images/IconSwapAccent1.png';
import IconSpinner from '../../assets/images/IconTransactionSending.gif';

import {
  getWalletChain,
  getBlockchainIcon,
  getWalletName,
} from '../../utils/wallet';
import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import storage from '../../utils/storage';
import STORAGE_KEYS from '../../utils/storageKeys';

const styles = StyleSheet.create({
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
  previewLogos: {
    marginLeft: theme.gutters.paddingNormal,
    marginRight: theme.gutters.paddingXS,
    marginTop: theme.gutters.paddingXXS,
  },
});

const BigDetailItem = ({ title, amount, symbol, logo, t }) => (
  <View
    style={[
      globalStyles.inlineWell,
      { flexDirection: 'column', alignItems: 'flex-start' },
    ]}>
    <GlobalText type="body1" color="secondary">
      {title}
    </GlobalText>
    <View style={[globalStyles.inline]}>
      <GlobalText type="headline2" nospace>
        {amount}
      </GlobalText>
      <GlobalImage
        style={[styles.previewLogos]}
        source={logo}
        size="xs"
        circle
      />
      <GlobalText type="headline2" nospace>
        {symbol}
      </GlobalText>
    </View>
  </View>
);

const GlobalButtonTimer = React.memo(function ({
  onConfirm,
  onQuote,
  processing,
  validAddress,
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
  const getConfirmBtnStatus = () =>
    countdown > 0 ? processing || !validAddress : processing;
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
      disabled={getConfirmBtnStatus()}
      {...props}
    />
  );
});

const mergeStealthExTokenData = (bsupp, tks) => {
  const isMatch = (tok1, tok2) =>
    tok1.symbol === tok2.symbol.toLowerCase() ||
    tok1.symbol === tok2.symbol.slice(0, 3).concat('sol').toLowerCase() ||
    tok1.symbol === tok2.symbol.slice(0, 4).concat('sol').toLowerCase();
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
  const [{ activeWallet, wallets, hiddenValue, config }, { importTokens }] =
    useContext(AppContext);
  const [step, setStep] = useState(1);
  const [tokens, setTokens] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [providerError, setProviderError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [featuredTokens, setFeaturedTokens] = useState([]);
  const [inToken, setInToken] = useState(null);
  const [outToken, setOutToken] = useState(null);
  const [status, setStatus] = useState();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const [result, setResult] = useState(false);
  const [minimalAmount, setMinimalAmount] = useState(null);

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SWAP);
  const current_blockchain = getWalletChain(activeWallet);

  const tokensAddresses = useMemo(
    () =>
      Object.keys(
        get(config, `${activeWallet?.getReceiveAddress()}.tokens`, {}),
      ),
    [activeWallet, config],
  );

  const RECIPIENT_OPTIONS = [
    { label: 'My Wallets', value: 'own' },
    { label: 'Other Wallet', value: 'other' },
  ];

  useEffect(() => {
    if (activeWallet) {
      invalidate(CACHE_TYPES.BRIDGE_SUPPORTED);
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
      ])
        .then(([balance, bsupp, ftks, avtks]) => {
          const tks = balance.items || [];
          const tksSupp = mergeStealthExTokenData(bsupp, tks);
          setTokens(tksSupp);
          setInToken(tks.length ? tks[0] : null);
          setOutToken(ftks.length ? ftks[0] : null);
          setFeaturedTokens(ftks);
          setAvailableTokens(avtks);
          setReady(true);
        })
        .catch(e => setProviderError(true));
    }
  }, [activeWallet, tokensAddresses, providerError]);

  const [inAmount, setInAmount] = useState(null);
  const [outAmount, setOutAmount] = useState('--');
  const [processingOutAmount, setProcessingOutAmount] = useState(false);

  const isMinimalAmount =
    minimalAmount && parseFloat(inAmount) >= minimalAmount;

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

  const debounceIn = useMemo(
    () =>
      debounce((inAmount, inToken, outToken) => {
        Promise.all([
          activeWallet.getBridgeEstimatedAmount(
            inToken.symbol.toLowerCase(),
            outToken.symbol,
            inAmount,
          ),
          activeWallet.getBridgeMinimalAmount(
            inToken.symbol.toLowerCase(),
            outToken.symbol,
          ),
        ]).then(([estAmount, minAmount]) => {
          setOutAmount(parseFloat(inAmount) >= minAmount ? estAmount : '--');
          setMinimalAmount(minAmount);
          setProcessingOutAmount(false);
        });
      }, 500),
    [activeWallet],
  );

  useEffect(() => {
    setProcessingOutAmount(true);
    if (Number(inAmount) > 0 && outToken) {
      setOutAmount('--');
      debounceIn(inAmount, inToken, outToken);
    } else {
      setOutAmount('--');
      setProcessingOutAmount(false);
    }
  }, [activeWallet, debounceIn, inAmount, inToken, outToken]);

  useEffect(() => {
    setError(false);
  }, [inAmount, inToken, outToken]);

  const zeroAmount = inToken && parseFloat(inAmount) <= 0;

  const validAmount =
    inToken &&
    parseFloat(inAmount) <= inToken.uiAmount &&
    parseFloat(inAmount) > 0 &&
    isMinimalAmount;

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const onConfirm = async () => {
    setError(false);
    setProcessing(true);
    try {
      setStatus(TRANSACTION_STATUS.CREATING);
      setStep(3);
      setStatus(TRANSACTION_STATUS.BRIDGING);
      const exDet = await activeWallet.createBridgeExchange(
        inToken.symbol.toLowerCase(),
        outToken.symbol,
        inAmount,
        recipientAddress,
      );
      const { txId } = await activeWallet.createTransferTransaction(
        exDet?.address_from,
        inToken.address,
        exDet?.expected_amount,
        { ...pick(inToken, 'decimals') },
      );
      await activeWallet.confirmTransferTransaction(txId);
      setStatus(TRANSACTION_STATUS.BRIDGE_SUCCESS);
      savePendingTx(exDet);
      trackEvent(EVENTS_MAP.BRIDGE_COMPLETED);
      setProcessing(false);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
      setStatus(TRANSACTION_STATUS.FAIL);
      trackEvent(EVENTS_MAP.BRIDGE_FAILED);

      setStep(3);
      setProcessing(false);
    }
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
          if (valid || !regex) {
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

  const savePendingTx = async exDet => {
    exDet.status = 'inProgress';
    const lastStatus = new Date().getTime();
    const expires = new Date().getTime() + 24 * 60 * 60 * 1000;
    let transactions = await storage.getItem(STORAGE_KEYS.PENDING_BRIDGE_TXS);
    if (transactions === null) transactions = [];
    transactions.push({
      account: activeWallet.publicKey,
      chain: activeWallet.chain,
      lastStatus,
      expires,
      ...exDet,
    });
    storage.setItem(STORAGE_KEYS.PENDING_BRIDGE_TXS, transactions);
  };

  return (
    <GlobalLayout>
      {step === 1 &&
        (providerError ? (
          <GlobalLayout.Header>
            <Header activeWallet={activeWallet} config={config} t={t} />
            <GlobalBackTitle title={t('actions.bridge')} />
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />
            <GlobalPadding size="xl" />

            <GlobalText type="body3" color="secondary" center>
              {t('bridge.provider_error')}
            </GlobalText>
            <GlobalPadding />

            <GlobalButton
              type="secondary"
              size="medium"
              title={t('actions.retry')}
              onPress={() => setProviderError(false)}
            />
          </GlobalLayout.Header>
        ) : (
          <>
            <GlobalLayout.Header>
              <Header activeWallet={activeWallet} config={config} t={t} />
              <GlobalBackTitle title={t('actions.bridge')} />
              <GlobalPadding />
              {ready && tokens.length && (
                <>
                  <View style={globalStyles.inlineFlexButtons}>
                    <GlobalText type="body2">{t('bridge.you_pay')}</GlobalText>
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
                    description={inToken.network || inToken.name}
                    tokens={tokens}
                    hiddenValue={hiddenValue}
                    image={getMediaRemoteUrl(inToken.logo)}
                    onChange={onChangeInToken}
                    invalid={!validAmount && !!inAmount}
                    number
                    chips
                  />
                  {zeroAmount ? (
                    <GlobalText type="body1" center color="negative">
                      {t(`token.send.amount.invalid`)}
                    </GlobalText>
                  ) : !isMinimalAmount && !!inAmount ? (
                    minimalAmount && (
                      <GlobalText type="body1" center color="negative">
                        {t(`bridge.less_than_minimal`, {
                          min: minimalAmount,
                          symbol: inToken.name,
                        })}
                      </GlobalText>
                    )
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
                    {showValue(inAmount * inToken.usdPrice, 6)}{' '}
                    {t('general.usd')}
                  </GlobalText>
                  <GlobalPadding size="sm" />

                  {processingOutAmount ? (
                    <GlobalImage
                      source={IconSpinner}
                      size="normal"
                      style={globalStyles.centeredSmall}
                      circle
                    />
                  ) : (
                    <GlobalImage
                      source={IconSwapAccent1}
                      size="normal"
                      style={globalStyles.centeredSmall}
                      circle
                    />
                  )}
                  <GlobalPadding size="sm" />
                  <GlobalText type="body2">{t('swap.you_receive')}</GlobalText>
                  <GlobalPadding size="xs" />

                  <InputWithTokenSelector
                    value={outAmount}
                    setValue={setOutAmount}
                    title={outToken ? outToken.symbol.toUpperCase() : '--'}
                    description={outToken.network || outToken.name}
                    tokens={availableTokens}
                    featuredTokens={featuredTokens}
                    image={
                      outToken ? getMediaRemoteUrl(outToken.logo) : undefined
                    }
                    onChange={setOutToken}
                    disabled
                    chips
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
                disabled={
                  !validAmount ||
                  !outToken ||
                  processing ||
                  processingOutAmount ||
                  outAmount === '--'
                }
                onPress={() => setStep(2)}
              />
            </GlobalLayout.Footer>
          </>
        ))}
      {step === 2 && (
        <>
          <GlobalLayout.Header>
            <GlobalBackTitle title={t('bridge.preview')} />
            <GlobalPadding />
            <BigDetailItem
              title={t('bridge.you_pay')}
              amount={inAmount}
              symbol={inToken.symbol.toUpperCase()}
              logo={inToken.logo || getBlockchainIcon(current_blockchain)}
            />
            <BigDetailItem
              title={t('swap.you_receive')}
              amount={outAmount}
              symbol={outToken.symbol.toUpperCase()}
              logo={outToken.logo || getBlockchainIcon(current_blockchain)}
            />
            <GlobalPadding size="lg" />
            <BasicRadios
              label={t('bridge.recipient_type')}
              value={recipientType}
              setValue={setRecipientType}
              options={RECIPIENT_OPTIONS}
            />
            {recipientType === 'other' && (
              <>
                <GlobalPadding size="lg" />
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
                    result && result.type !== 'SUCCESS'
                      ? styles[result.type]
                      : {}
                  }
                  style={{ paddingHorizontal: theme.gutters.paddingSM }}
                />
                <GlobalPadding size="xl" />
                <GlobalAlert
                  type="warning"
                  noIcon
                  text={t('bridge.other_wallet_alert', {
                    to: outToken.network || outToken.name,
                  })}
                />
              </>
            )}
            {wallets.length > 0 && recipientType === 'own' && (
              <>
                <GlobalPadding size="xxs" />
                <GlobalCollapse
                  title={t('settings.wallets.my_wallets')}
                  titleStyle={styles.titleStyle}
                  isOpen
                  hideCollapse>
                  {wallets.map(
                    wallet =>
                      (wallet.chain === outToken.network.toUpperCase() ||
                        wallet.chain ===
                          outToken.name.toUpperCase().split(' ')[0]) && (
                        <CardButtonWallet
                          key={wallet.address}
                          title={getWalletName(wallet.address, config)}
                          address={wallet.address}
                          chain={wallet.chain}
                          imageSize="md"
                          onPress={() => setRecipientAddress(wallet.address)}
                          buttonStyle={globalStyles.addressBookItem}
                          touchableStyles={globalStyles.addressBookTouchable}
                          transparent
                        />
                      ),
                  )}
                </GlobalCollapse>
                <GlobalPadding size="md" />
                <GlobalAlert
                  type="warning"
                  noIcon
                  text={t('bridge.own_wallet_alert', {
                    from: inToken.network || inToken.name,
                    to: outToken.network || outToken.name,
                  })}
                />
              </>
            )}
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
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
              onConfirm={onConfirm}
              onQuote={onRefreshEstimate}
              processing={processing}
              validAddress={validAddress}
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
              <GlobalPadding size="4xl" />
            </View>
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            {(status === 'bridge_success' || status === 'fail') && (
              <GlobalButton
                type="secondary"
                title={t(`general.close`)}
                wide
                onPress={goToBack}
                style={globalStyles.button}
                touchableStyles={globalStyles.buttonTouchable}
              />
            )}
          </GlobalLayout.Footer>
        </>
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(BridgePage);
