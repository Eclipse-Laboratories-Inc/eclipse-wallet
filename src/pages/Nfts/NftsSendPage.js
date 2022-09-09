import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import {
  getTransactionImage,
  getWalletName,
  TRANSACTION_STATUS,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import IconExpandMoreAccent1 from '../../assets/images/IconExpandMoreAccent1.png';
import InputAddress from '../../features/InputAddress/InputAddress';
import { isNative } from '../../utils/platform';
import QRScan from '../../features/QRScan/QRScan';

const styles = StyleSheet.create({
  mediumSizeImage: {
    width: 234,
    height: 234,
  },
});

const NftsSendPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [finish, setFinish] = useState(false);
  const [status, setStatus] = useState();
  const [step, setStep] = useState(1);
  const [nftDetail, setNftDetail] = useState({});
  const [{ activeWallet, config, addressBook }] = useContext(AppContext);
  const [validAddress, setValidAddress] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [showScan, setShowScan] = useState(false);

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
    navigate(ROUTES_MAP.NFTS_DETAIL, { id: params.id });
  };

  const onSend = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setSending(true);
      try {
        console.log({ recipientAddress, s: nftDetail.mint });
        const res = await activeWallet.transfer(
          recipientAddress,
          nftDetail.mint,
          1,
        );
        setSending(false);
        setFinish(true);
        setStatus(TRANSACTION_STATUS.SUCCESS);
      } catch (e) {
        console.error(e);
        setSending(false);
        setFinish(true);
        setStatus(TRANSACTION_STATUS.FAIL);
      }
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

  return (
    (loaded && (
      <>
        {!sending && !finish && (
          <GlobalLayout fullscreen>
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
                {nftDetail.name}
              </GlobalText>

              <View style={globalStyles.centered}>
                <View
                  style={[globalStyles.squareRatio, styles.mediumSizeImage]}>
                  <GlobalImage
                    source={getMediaRemoteUrl(nftDetail.media)}
                    style={globalStyles.bigImage}
                    square
                    squircle
                  />
                </View>
              </View>

              <GlobalPadding size="xl" />
              {step === 1 && (
                <>
                  <InputAddress
                    address={recipientAddress}
                    onChange={setRecipientAddress}
                    validAddress={validAddress}
                    addressEmpty={addressEmpty}
                    setValidAddress={setValidAddress}
                    setAddressEmpty={setAddressEmpty}
                    onQR={toggleScan}
                  />
                  <GlobalPadding />

                  {addressBook.length > 0 && (
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
                          onPress={() =>
                            setRecipientAddress(addressBookItem.address)
                          }
                          buttonStyle={globalStyles.addressBookItem}
                          touchableStyles={globalStyles.addressBookTouchable}
                          transparent
                        />
                      ))}
                    </GlobalCollapse>
                  )}
                </>
              )}

              <GlobalPadding />
              {step === 2 && (
                <View style={globalStyles.centered}>
                  <GlobalPadding />

                  <GlobalText type="subtitle2" center>
                    {t('nft.send_to')}
                  </GlobalText>

                  <GlobalPadding />

                  <GlobalImage source={IconExpandMoreAccent1} size="md" />

                  <GlobalPadding />

                  <GlobalText type="subtitle1" center>
                    {recipientAddress}
                  </GlobalText>
                </View>
              )}
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title={t(`actions.cancel`)}
                onPress={goToBack}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                type="primary"
                flex
                title={t(`actions.send`)}
                onPress={onSend}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
                disabled={!validAddress}
                key={'send-button'}
              />
            </GlobalLayout.Footer>
            {isNative() && (
              <QRScan active={showScan} onClose={toggleScan} onRead={onRead} />
            )}
          </GlobalLayout>
        )}

        {sending && (
          <GlobalLayout fullscreen>
            <GlobalLayout.Header>
              <GlobalPadding size="4xl" />
              <GlobalPadding size="4xl" />

              <GlobalText type="headline2" center>
                {t('general.sending')}
              </GlobalText>
            </GlobalLayout.Header>

            <GlobalLayout.Footer>
              <GlobalButton
                type="primary"
                wide
                title={t('transactions.view_transaction')}
                onPress={() => {}}
                key={'send-button'}
              />
            </GlobalLayout.Footer>
          </GlobalLayout>
        )}

        {finish && (
          <GlobalLayout fullscreen>
            <GlobalLayout.Header>
              <GlobalPadding size="4xl" />
              <GlobalPadding size="4xl" />

              <View style={globalStyles.centeredSmall}>
                <GlobalImage
                  source={getTransactionImage(status)}
                  size="3xl"
                  circle
                />
                <GlobalPadding />
                <GlobalText type="headline2" center>
                  {t(`token.send.transaction_${status}`)}
                </GlobalText>
                <GlobalText type="body1" center>
                  3 lines max Excepteur sint occaecat cupidatat non proident,
                  sunt ?
                </GlobalText>

                <GlobalPadding size="4xl" />
              </View>
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title={t('general.close')}
                onPress={goToBack}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </GlobalLayout>
        )}
      </>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsSendPage));
