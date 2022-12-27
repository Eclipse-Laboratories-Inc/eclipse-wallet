import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import {
  getTransactionImage,
  getWalletName,
  TRANSACTION_STATUS,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
import { TOKEN_DECIMALS, DEFAULT_SYMBOL } from '../Transactions/constants';

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

import { getWalletChain } from '../../utils/wallet';
import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import useUserConfig from '../../hooks/useUserConfig';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

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
  const [{ activeWallet, wallets, config, addressBook }] =
    useContext(AppContext);
  const [validAddress, setValidAddress] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [inputAddress, setInputAddress] = useState('');
  const current_blockchain = getWalletChain(activeWallet);
  const { explorer } = useUserConfig(
    current_blockchain,
    activeWallet.networkId,
  );

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.NFT_SEND);

  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS_ALL,
        () => activeWallet.getAllNfts(),
      ).then(nfts => {
        const nft = nfts.find(n => n.mint === params.id);
        if (nft) {
          setNftDetail(nft);
        }
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);

  const goToBack = () => {
    if (step === 3) {
      navigate(APP_ROUTES_MAP.WALLET);
    } else {
      setStep(step - 1);
    }
  };

  const onCancel = () =>
    navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: params.id });

  const onNext = async () => {
    if (!addressEmpty) {
      setLoaded(false);
      setStep(2);
      try {
        const feeSend = await activeWallet.estimateTransferFee(
          recipientAddress,
          nftDetail.mint,
          1,
        );
        setFee(feeSend);
        setLoaded(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onSend = async () => {
    setSending(true);
    try {
      setStatus(TRANSACTION_STATUS.CREATING);
      setStep(3);
      const txId = await activeWallet.createTransferTransaction(
        recipientAddress,
        nftDetail.mint,
        1,
        { isNft: true, contractId: nftDetail.contractId },
      );
      setTransactionId(txId);
      setStatus(TRANSACTION_STATUS.SENDING);
      await activeWallet.confirmTransferTransaction(txId);
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
              inlineTitle={getWalletName(
                activeWallet.getReceiveAddress(),
                config,
              )}
              inlineAddress={activeWallet.getReceiveAddress()}
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

            {wallets.length > 0 && (
              <>
                <GlobalPadding />

                <GlobalCollapse
                  title={t('settings.wallets.my_wallets')}
                  titleStyle={styles.titleStyle}
                  isOpen
                  hideCollapse>
                  {wallets.map(wallet => (
                    <CardButtonWallet
                      key={wallet.address}
                      title={getWalletName(wallet.address, config)}
                      address={wallet.address}
                      chain={wallet.chain}
                      imageSize="md"
                      onPress={() => setInputAddress(wallet.address)}
                      buttonStyle={globalStyles.addressBookItem}
                      touchableStyles={globalStyles.addressBookTouchable}
                      transparent
                    />
                  ))}
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
                  {addressBook.map(addressBookItem => (
                    <CardButtonWallet
                      key={addressBookItem.address}
                      title={addressBookItem.name}
                      address={addressBookItem.address}
                      chain={addressBookItem.chain}
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
              inlineTitle={getWalletName(
                activeWallet.getReceiveAddress(),
                config,
              )}
              inlineAddress={activeWallet.getReceiveAddress()}
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
                <GlobalText type="caption" style={{ fontSize: 8 }}>
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
                    {fee / TOKEN_DECIMALS[current_blockchain]}{' '}
                    {DEFAULT_SYMBOL[current_blockchain]}
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
              {/* {(status === 'success' || status === 'fail') && (
                  <GlobalText type="body1" center>
                    3 lines max Excepteur sint occaecat cupidatat non proident,
                    sunt ?
                  </GlobalText>
                )} */}

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
  ) : (
    <GlobalSkeleton type="NftDetail" />
  );
};

export default withParams(withTranslation()(NftsSendPage));
