import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { getWalletName } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
import { isCollection } from '../../utils/nfts';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';

import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import IconExpandMoreAccent1 from '../../assets/images/IconExpandMoreAccent1.png';

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
  const [nftDetail, setNftDetail] = useState({});
  const [{ activeWallet, config, addressBook }] = useContext(AppContext);

  const [validAddress, setValidAddress] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const onRecipientChange = v => {
    setValidAddress(false);
    setRecipientAddress(v);
  };

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

  const onSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFinish(true);
    }, 2000);
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
                    source={getMediaRemoteUrl(
                      isCollection(nftDetail)
                        ? nftDetail.thumb
                        : nftDetail.media,
                    )}
                    style={globalStyles.bigImage}
                    square
                    squircle
                  />
                </View>
              </View>

              <GlobalPadding size="xl" />

              <GlobalInputWithButton
                // startLabel={t('general.to')}
                placeholder={t('general.recipient_s_address', {
                  token: 'SOL',
                })}
                value={recipientAddress}
                setValue={setRecipientAddress}
                onActionPress={() => {}}
                buttonIcon={IconQRCodeScanner}
                buttonOnPress={() => {}}
              />

              {addressBook.size > 0 && (
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
                        onPress={() =>
                          onRecipientChange(addressBookItem.address)
                        }
                        buttonStyle={globalStyles.addressBookItem}
                        touchableStyles={globalStyles.addressBookTouchable}
                        transparent
                      />
                    ))}
                  </GlobalCollapse>
                </>
              )}

              <GlobalPadding />

              <View style={globalStyles.centered}>
                <GlobalInputWithButton
                  // startLabel={t('general.to')}
                  placeholder={t('general.recipient_s_address', {
                    token: 'SOL',
                  })}
                  value={recipientAddress}
                  setValue={setRecipientAddress}
                  invalid
                />

                <GlobalPadding />

                <GlobalInputWithButton
                  // startLabel={t('general.to')}
                  placeholder={t('general.recipient_s_address', {
                    token: 'SOL',
                  })}
                  value={recipientAddress}
                  setValue={setRecipientAddress}
                  complete
                  editable={false}
                />

                <GlobalPadding />

                <GlobalText type="subtitle2" center>
                  {t('nft.send_to')}
                </GlobalText>

                <GlobalPadding />

                <GlobalImage source={IconExpandMoreAccent1} size="md" />

                <GlobalPadding />

                <GlobalText type="subtitle1" center>
                  Bored Ape Yacht Club
                </GlobalText>
              </View>
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
                disabled={!recipientAddress}
                key={'send-button'}
              />
            </GlobalLayout.Footer>
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

              <GlobalText type="headline2" center>
                {t('general.sent')}
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
      </>
    )) ||
    null
  );
};

export default withParams(withTranslation()(NftsSendPage));
