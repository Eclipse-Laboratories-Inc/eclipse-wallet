import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { pick } from 'lodash';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { getTransactionImage, TRANSACTION_STATUS } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import IconExpandMoreAccent1 from '../../assets/images/IconExpandMoreAccent1.png';
import IconCopy from '../../assets/images/IconCopy.png';
import InputAddress from '../../features/InputAddress/InputAddress';
import { isNative } from '../../utils/platform';
import QRScan from '../../features/QRScan/QRScan';
import clipboard from '../../utils/clipboard.native';
import storage from '../../utils/storage';
import STORAGE_KEYS from '../../utils/storageKeys';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import useUserConfig from '../../hooks/useUserConfig';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';
import { formatCurrency } from '../../utils/amount';

const styles = StyleSheet.create({
  mediumSizeImage: {
    width: 234,
    height: 234,
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
    fontSize: 12,
  },
});

const NftsSendPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState();
  const [step, setStep] = useState(1);
  const [nftDetail, setNftDetail] = useState({});
  const [transactionId, setTransactionId] = useState();
  const [fee, setFee] = useState(null);
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
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [inputAddress, setInputAddress] = useState('');
  const { explorer } = useUserConfig();

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.NFT_SEND);

  useEffect(() => {
    if (activeBlockchainAccount) {
      activeBlockchainAccount.getAllNfts().then(nfts => {
        const nft = nfts.find(n => n.mint === params.id);
        if (nft) {
          setNftDetail(nft);
        }
        setLoaded(true);
      });
    }
  }, [activeBlockchainAccount, params.id]);

  const goToBack = () => {
    if (step === 1 || step === 3) {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: params.id });
    } else {
      setStep(step - 1);
    }
  };

  const onCancel = () =>
    navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: params.id });

  const onNext = async () => {
    setLoaded(false);
    setStep(2);
    try {
      const feeSend = await activeBlockchainAccount.estimateTransferFee(
        recipientAddress,
        nftDetail.mint,
        1,
        { ...pick(nftDetail, ['contract', 'standard']) },
      );
      setFee(feeSend);
    } catch (e) {
      console.error(e);
    } finally {
      setLoaded(true);
    }
  };

  const onSend = async () => {
    setSending(true);
    try {
      setStatus(TRANSACTION_STATUS.CREATING);
      setStep(3);
      const { txId } = await activeBlockchainAccount.createTransferTransaction(
        recipientAddress,
        nftDetail.mint,
        1,
        { ...pick(nftDetail, ['contract', 'standard']) },
      );
      setTransactionId(txId);
      setStatus(TRANSACTION_STATUS.SENDING);
      savePendingNftSend();
      await activeBlockchainAccount.confirmTransferTransaction(txId);
      setStatus(TRANSACTION_STATUS.SUCCESS);
      trackEvent(EVENTS_MAP.NFT_SEND_COMPLETED);
      setSending(false);
    } catch (e) {
      console.error(e);
      setStatus(TRANSACTION_STATUS.FAIL);
      trackEvent(EVENTS_MAP.NFT_SEND_FAILED);
      setStep(3);
      setSending(false);
    }
  };

  const savePendingNftSend = async () => {
    const pendingExpires = new Date().getTime() + 60 * 1000;
    let pendingNfts = await storage.getItem(STORAGE_KEYS.PENDING_NFTS_SEND);
    if (pendingNfts === null) pendingNfts = [];
    pendingNfts.push({
      ...nftDetail,
      pending: true,
      pendingExpires,
    });
    storage.setItem(STORAGE_KEYS.PENDING_NFTS_SEND, pendingNfts);
  };

  const toggleScan = () => {
    setShowScan(!showScan);
  };
  const onRead = qr => {
    const data = qr;
    setRecipientAddress(data.data);
    setShowScan(false);
  };

  const openTransaction = async () => {
    const url = `${explorer.url}/${transactionId}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  return loaded ? (
    <GlobalLayout fullscreen>
      {step === 1 && (
        <>
          <GlobalLayout.Header>
            <GlobalBackTitle
              onBack={goToBack}
              inlineTitle={activeBlockchainAccount.name}
              inlineAddress={activeBlockchainAccount.getReceiveAddress()}
            />

            <GlobalText type="headline2" center>
              {nftDetail.name || nftDetail.symbol}
            </GlobalText>

            <View style={globalStyles.centered}>
              <View style={[globalStyles.squareRatio, styles.mediumSizeImage]}>
                <GlobalImage
                  source={getMediaRemoteUrl(nftDetail.media)}
                  style={globalStyles.bigImage}
                  square
                  squircle
                />
              </View>
            </View>

            <GlobalPadding size="xl" />

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
                        onPress={() => setInputAddress(addressBookItem.address)}
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
              inlineTitle={activeAccount.name}
              inlineAddress={activeBlockchainAccount.getReceiveAddress()}
            />

            <GlobalText type="headline2" center>
              {nftDetail.name || nftDetail.symbol}
            </GlobalText>

            <View style={globalStyles.centered}>
              <View style={[globalStyles.squareRatio, styles.mediumSizeImage]}>
                <GlobalImage
                  source={getMediaRemoteUrl(nftDetail.media)}
                  style={globalStyles.bigImage}
                  square
                  squircle
                />
              </View>

              <GlobalPadding size="xl" />

              <GlobalText type="subtitle2" center>
                {t('nft.send_to')}
              </GlobalText>

              <GlobalPadding />

              <GlobalImage source={IconExpandMoreAccent1} size="md" />

              <GlobalPadding />

              <GlobalPadding size="md" />

              <View style={globalStyles.inlineWell}>
                <GlobalText type="caption" style={styles.recipientTx}>
                  {recipientAddress}
                </GlobalText>

                <GlobalButton
                  onPress={() => clipboard.copy(recipientAddress)}
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

          <GlobalPadding />

          <GlobalLayout.Footer inlineFlex>
            <GlobalButton
              type="secondary"
              flex
              title={t(`actions.cancel`)}
              onPress={onCancel}
              style={[globalStyles.button, globalStyles.buttonLeft]}
              touchableStyles={globalStyles.buttonTouchable}
            />

            <GlobalButton
              disabled={sending}
              type="primary"
              flex
              title={t(`actions.send`)}
              onPress={onSend}
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
              transactionId && (
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
              )
            )}
          </GlobalLayout.Footer>
        </>
      )}
    </GlobalLayout>
  ) : (
    <GlobalSkeleton type="NftDetail" />
  );
};

export default withParams(withTranslation()(NftsSendPage));
