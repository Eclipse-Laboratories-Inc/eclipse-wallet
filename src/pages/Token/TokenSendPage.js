import React, { useState, useContext, useMemo } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { BLOCKCHAINS } from 'eclipse-wallet-adapter';
import { pick } from 'lodash';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { getTransactionImage, TRANSACTION_STATUS } from '../../utils/wallet';
import useToken from '../../hooks/useToken';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';

import IconCopy from '../../assets/images/IconCopy.png';
import IconExpandMoreAccent1 from '../../assets/images/IconExpandMoreAccent1.png';
import InputAddress from '../../features/InputAddress/InputAddress';
import QRScan from '../../features/QRScan/QRScan';
import { isNative } from '../../utils/platform';
import { formatCurrency, showValue } from '../../utils/amount';
import clipboard from '../../utils/clipboard.native';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import useUserConfig from '../../hooks/useUserConfig';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';
import storage from '../../utils/storage';
import STORAGE_KEYS from '../../utils/storageKeys';

const styles = StyleSheet.create({
  buttonStyle: {
    paddingHorizontal: 0,
  },
  touchableStyles: {
    marginBottom: 0,
  },
  titleStyle: {
    color: theme.colors.labelTertiary,
  },
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
  recipientTx: {
    width: '90%',
  },
});

const TokenSendPage = ({ params, t }) => {
  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SEND_TOKEN);
  const navigate = useNavigation();
  const { token, loaded } = useToken({ tokenId: params.tokenId });
  const [step, setStep] = useState(params.toAddress ? 2 : 1);
  const [
    {
      accounts,
      activeAccount,
      activeBlockchainAccount,
      networkId,
      addressBook,
    },
  ] = useContext(AppContext);
  const [validAddress, setValidAddress] = useState(false);
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [sending, setSending] = useState(false);
  const [fee, setFee] = useState(null);
  const [transactionId, setTransactionId] = useState();
  const [status, setStatus] = useState();
  const [showScan, setShowScan] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(
    params.toAddress || '',
  );
  const [recipientAmount, setRecipientAmount] = useState('');
  const isBitcoin = useMemo(
    () => activeBlockchainAccount.network.blockchain === BLOCKCHAINS.BITCOIN,
    [activeBlockchainAccount],
  );
  const { explorer } = useUserConfig();

  const zeroAmount = recipientAmount && parseFloat(recipientAmount) <= 0;
  const validAmount =
    parseFloat(recipientAmount) <= token.uiAmount &&
    parseFloat(recipientAmount) > 0;

  const onCancel = () => {
    trackEvent(EVENTS_MAP.TOKEN_SEND_CANCELLED);
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const goToBack = () => {
    if (step === 4) {
      navigate(APP_ROUTES_MAP.WALLET);
    } else if (step === 1) {
      navigate(APP_ROUTES_MAP.WALLET);
    }
    setStep(step - 1);
  };

  const onNext = async () => {
    if (step === 2) {
      if (!addressEmpty) {
        const feeSend = await activeBlockchainAccount.estimateTransferFee(
          recipientAddress,
          token.address,
          recipientAmount,
          { ...pick(token, 'decimals') },
        );
        setFee(feeSend);
      }
    }
    setStep(step + 1);
  };
  const onSend = async () => {
    setSending(true);
    try {
      setStatus(TRANSACTION_STATUS.CREATING);
      setStep(4);
      const { txId, executableTx } =
        await activeBlockchainAccount.createTransferTransaction(
          recipientAddress,
          token.address,
          recipientAmount,
          { ...pick(token, 'decimals') },
        );
      setTransactionId(txId);
      setStatus(TRANSACTION_STATUS.SENDING);
      await activeBlockchainAccount.confirmTransferTransaction(
        isBitcoin ? executableTx : txId,
      );
      setStatus(TRANSACTION_STATUS.SUCCESS);
      if (isBitcoin) {
        savePendingTx(txId, token.symbol, recipientAmount);
      }
      trackEvent(EVENTS_MAP.TOKEN_SEND_COMPLETED);
      setSending(false);
    } catch (e) {
      console.error(e);
      setStatus(TRANSACTION_STATUS.FAIL);
      trackEvent(EVENTS_MAP.TOKEN_SEND_FAILED);
      setStep(4);
      setSending(false);
    }
  };
  const toggleScan = () => {
    setShowScan(!showScan);
  };
  const onRead = qr => {
    const data = qr;
    setInputAddress(data.data);
    setShowScan(false);
  };

  const recipient = recipientName || recipientAddress;

  const openTransaction = async () => {
    const url = `${explorer.url}/${transactionId}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  const savePendingTx = async (txId, tokenSymbol, amount) => {
    if (isBitcoin) {
      const lastStatus = new Date().getTime();
      const expires = new Date().getTime() + 24 * 60 * 60 * 1000;
      let transactions = await storage.getItem(STORAGE_KEYS.PENDING_TXS);
      if (transactions === null) transactions = [];
      transactions.push({
        account: activeBlockchainAccount.publicKey,
        chain: activeBlockchainAccount.network.blockchain,
        txId,
        recipient,
        tokenSymbol,
        amount,
        status: 'inProgress',
        lastStatus,
        expires,
      });
      storage.setItem(STORAGE_KEYS.PENDING_TXS, transactions);
    }
  };

  return (
    loaded && (
      <GlobalLayout fullscreen>
        {step === 1 && (
          <>
            <GlobalLayout.Header>
              <GlobalBackTitle
                onBack={goToBack}
                title={`${t('token.action.send')} ${token.symbol}`}
                nospace
              />

              <CardButtonWallet
                title={t('token.send.from', { name: activeAccount.name })}
                address={activeBlockchainAccount.getReceiveAddress()}
                image={token.logo}
                imageSize="md"
                buttonStyle={styles.buttonStyle}
                touchableStyles={styles.touchableStyles}
                transparent
                readonly
              />

              <InputAddress
                address={inputAddress}
                publicKey={recipientAddress}
                domain={recipientName}
                validAddress={validAddress}
                addressEmpty={addressEmpty}
                onChange={setInputAddress}
                setValidAddress={setValidAddress}
                setDomain={setRecipientName}
                setAddressEmpty={setAddressEmpty}
                setPublicKey={setRecipientAddress}
                onQR={toggleScan}
              />

              {accounts.length > 0 && (
                <>
                  <GlobalPadding />

                  <GlobalCollapse
                    title={t('settings.wallets.my_wallets')}
                    titleStyle={styles.titleStyle}
                    isOpen
                    hideCollapse>
                    {accounts.flatMap(account =>
                      account.networksAccounts[networkId]
                        .filter(
                          blockchainAccount =>
                            blockchainAccount.getReceiveAddress() !==
                            activeBlockchainAccount.getReceiveAddress(),
                        )
                        .map(blockchainAccount => (
                          <CardButtonWallet
                            key={blockchainAccount.getReceiveAddress()}
                            title={account.name}
                            address={blockchainAccount.getReceiveAddress()}
                            image={blockchainAccount.network.icon}
                            imageSize="md"
                            onPress={() =>
                              setInputAddress(
                                blockchainAccount.getReceiveAddress(),
                              )
                            }
                            buttonStyle={globalStyles.addressBookItem}
                            touchableStyles={globalStyles.addressBookTouchable}
                            transparent
                          />
                        )),
                    )}
                  </GlobalCollapse>
                </>
              )}

              {addressBook.length > 0 && (
                <>
                  <GlobalPadding />

                  <GlobalCollapse
                    title={t('settings.address_book')}
                    titleStyle={styles.titleStyle}
                    isOpen
                    hideCollapse>
                    {addressBook
                      .filter(
                        addressBookItem =>
                          addressBookItem.address !==
                            activeBlockchainAccount.getReceiveAddress() &&
                          addressBookItem.network.id === networkId,
                      )
                      .map(addressBookItem => (
                        <CardButtonWallet
                          key={addressBookItem.address}
                          title={addressBookItem.name}
                          address={addressBookItem.address}
                          image={addressBookItem.network.icon}
                          imageSize="md"
                          onPress={() =>
                            setInputAddress(addressBookItem.address)
                          }
                          buttonStyle={globalStyles.addressBookItem}
                          touchableStyles={globalStyles.addressBookTouchable}
                          transparent
                        />
                      ))}
                  </GlobalCollapse>
                </>
              )}
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title="Cancel"
                onPress={onCancel}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                type="primary"
                flex
                disabled={!validAddress}
                title={t('token.send.next')}
                onPress={onNext}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </GlobalLayout.Footer>
            {isNative() && (
              <QRScan active={showScan} onClose={toggleScan} onRead={onRead} />
            )}
          </>
        )}
        {step === 2 && (
          <>
            <GlobalLayout.Header>
              <GlobalBackTitle
                onBack={goToBack}
                title={`${t('token.action.send')} ${token.symbol}`}
                nospace
              />
              <GlobalPadding />
              <GlobalText type="body1" style={globalStyles.labelRight}>
                {`${t('general.balance')}: ${token.uiAmount}`}
              </GlobalText>
              <GlobalInputWithButton
                startLabel={token.symbol}
                placeholder="Enter Amount"
                value={recipientAmount}
                setValue={setRecipientAmount}
                keyboardType="numeric"
                buttonLabel={t('general.max')}
                buttonOnPress={() => setRecipientAmount(`${token.uiAmount}`)}
                invalid={!validAmount && !!recipientAmount}
                number
              />

              {zeroAmount ? (
                <GlobalText type="body1" center color="negative">
                  {t(`token.send.amount.invalid`)}
                </GlobalText>
              ) : (
                !validAmount &&
                !!recipientAmount && (
                  <GlobalText type="body1" center color="negative">
                    {t(`token.send.amount.insufficient`, {
                      max: token.uiAmount,
                    })}
                  </GlobalText>
                )
              )}

              <GlobalPadding />

              {token.usdPrice && (
                <GlobalText type="subtitle2" center>
                  {showValue(recipientAmount * token.usdPrice, 6)} USD
                </GlobalText>
              )}
              <GlobalPadding size="md" />
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title="Cancel"
                onPress={onCancel}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                type="primary"
                flex
                disabled={!validAmount}
                title={t('token.send.next')}
                onPress={onNext}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </>
        )}
        {step === 3 && (
          <>
            <GlobalLayout.Header>
              <GlobalBackTitle
                onBack={goToBack}
                title={`${t('token.action.send')} ${token.symbol}`}
                nospace
              />
              <GlobalPadding size="2xl" />

              <View style={globalStyles.centered}>
                <GlobalImage
                  source={token.logo}
                  size="xxl"
                  style={globalStyles.bigImage}
                  circle
                />

                <GlobalPadding size="4xl" />

                <GlobalText type="headline1" center>
                  {recipientAmount} {token.symbol}
                </GlobalText>

                <GlobalImage source={IconExpandMoreAccent1} size="md" />

                <GlobalPadding />

                <GlobalPadding size="md" />

                <View style={globalStyles.inlineWell}>
                  <GlobalText type="caption" style={styles.recipientTx}>
                    {recipient}
                  </GlobalText>

                  <GlobalButton
                    onPress={() => clipboard.copy(recipient)}
                    transparent>
                    <GlobalImage source={IconCopy} size="xs" />
                  </GlobalButton>
                </View>
                {fee && !addressEmpty && (
                  <View style={globalStyles.inlineWell}>
                    <GlobalText type="caption" color="tertiary">
                      Network Fee
                    </GlobalText>

                    <GlobalText type="body2">
                      {formatCurrency(
                        fee,
                        activeBlockchainAccount.network.currency,
                      )}
                    </GlobalText>
                  </View>
                )}
                {addressEmpty && (
                  <GlobalText type="caption" center color={'warning'}>
                    {t(`token.send.empty_account_fee`)}
                  </GlobalText>
                )}
              </View>
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title={t('actions.cancel')}
                onPress={onCancel}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                disabled={sending}
                type="primary"
                flex
                title={t('general.confirm')}
                onPress={onSend}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </>
        )}
        {step === 4 && (
          <>
            <GlobalLayout.Header>
              <GlobalPadding size="4xl" />
              <GlobalPadding size="4xl" />
              <GlobalPadding size="4xl" />

              {(status === 'creating' || status === 'sending') && (
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
                    type={status === 'sending' ? 'subtitle2' : 'headline2'}
                    color={status === 'sending' && 'secondary'}
                    center>
                    {t(`token.send.transaction_${status}`)}
                  </GlobalText>
                )}

                <GlobalPadding size="4xl" />
              </View>
            </GlobalLayout.Header>

            <GlobalLayout.Footer>
              {status === 'success' || status === 'fail' ? (
                <>
                  {transactionId && (
                    <GlobalButton
                      type="primary"
                      wide
                      title={t(`token.send.goto_explorer`)}
                      onPress={openTransaction}
                      style={globalStyles.button}
                      touchableStyles={globalStyles.buttonTouchable}
                    />
                  )}

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
                    status === 'creating'
                      ? styles.creatingTx
                      : styles.viewTxLink
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
    )
  );
};

export default withParams(withTranslation()(TokenSendPage));
