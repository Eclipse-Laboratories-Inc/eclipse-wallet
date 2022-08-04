import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { withTranslation } from '../../hooks/useTranslations';
import {
  LOGOS,
  getTransactionImage,
  TRANSACTION_STATUS,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
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
});

const TokenSendPage = ({ params, t }) => {
  const navigate = useNavigation();
  const { token, loaded } = useToken({ tokenId: params.tokenId });
  const [step, setStep] = useState(1);
  const [{ activeWallet, addressBook }] = useContext(AppContext);
  const [validAddress, setValidAddress] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientAmount, setRecipientAmount] = useState('');

  const validAmount =
    parseFloat(recipientAmount) <= token.uiAmount &&
    parseFloat(recipientAmount) > 0;
  const goToBack = () => {
    navigate(ROUTES_MAP.WALLET);
  };
  const onNext = () => setStep(step + 1);
  const onSend = async () => {
    setSending(true);
    try {
      const result = await activeWallet.transfer(
        recipientAddress,
        token.address,
        recipientAmount,
      );
      setStatus(TRANSACTION_STATUS.SUCCESS);
      setStep(3);
      setSending(false);
    } catch (e) {
      console.error(e);
      setStatus(TRANSACTION_STATUS.FAIL);
      setStep(3);
      setSending(false);
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
                title={t('token.send.from', { name: token.name })}
                address={token.address}
                chain="SOLANA"
                imageSize="md"
                buttonStyle={styles.buttonStyle}
                touchableStyles={styles.touchableStyles}
                transparent
                readonly
              />

              <InputAddress
                address={recipientAddress}
                onChange={setRecipientAddress}
                validAddress={validAddress}
                setValidAddress={setValidAddress}
              />

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
                        onPress={() =>
                          setRecipientAddress(addressBookItem.address)
                        }
                        buttonStyle={globalStyles.addressBookItem}
                        touchableStyles={globalStyles.addressBookTouchable}
                        transparent
                      />
                    ))}
                  </GlobalCollapse>
                </>
              )}

              <GlobalPadding size="4xl" />
              {validAddress && validAddress.type !== 'ERROR' && (
                <>
                  <GlobalInputWithButton
                    startLabel={token.symbol}
                    placeholder="Enter Amount"
                    value={recipientAmount}
                    setValue={setRecipientAmount}
                    keyboardType="numeric"
                    buttonLabel={t('general.max')}
                    buttonOnPress={() =>
                      setRecipientAmount(`${token.uiAmount}`)
                    }
                    invalid={!validAmount && !!recipientAmount}
                  />
                  {!validAmount && !!recipientAmount && (
                    <GlobalText type="body1" center color="negative">
                      {t(`token.send.amount.invalid`, { max: token.uiAmount })}
                    </GlobalText>
                  )}

                  <GlobalPadding />

                  <GlobalText type="subtitle2" center>
                    -0 USD
                  </GlobalText>
                </>
              )}

              <GlobalPadding size="md" />
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title="Cancel"
                onPress={goToBack}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                type="primary"
                flex
                disabled={!validAddress || !validAmount}
                title={t('token.send.next')}
                onPress={onNext}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </GlobalLayout.Footer>
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
              <GlobalPadding size="4xl" />

              <View style={globalStyles.centered}>
                <GlobalImage
                  source={getMediaRemoteUrl(LOGOS.SOLANA)}
                  size="xxl"
                  style={globalStyles.bigImage}
                  circle
                />

                <GlobalText type="headline1" center>
                  {recipientAmount} {token.symbol}
                </GlobalText>

                <GlobalImage source={IconExpandMoreAccent1} size="md" />

                <GlobalPadding />

                <GlobalText type="subtitle2" center>
                  Name.SOL
                </GlobalText>

                <GlobalPadding size="md" />

                <View style={globalStyles.inlineWell}>
                  <GlobalText type="body2">Name.SOL</GlobalText>

                  <GlobalButton onPress={() => {}} transparent>
                    <GlobalImage source={IconCopy} size="xs" />
                  </GlobalButton>
                </View>

                <View style={globalStyles.inlineWell}>
                  <GlobalText type="caption" color="tertiary">
                    Network Fee
                  </GlobalText>

                  <GlobalText type="body2">$ 8.888.16</GlobalText>
                </View>
              </View>
            </GlobalLayout.Header>

            <GlobalLayout.Footer inlineFlex>
              <GlobalButton
                type="secondary"
                flex
                title="Cancel"
                onPress={goToBack}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />

              <GlobalButton
                disabled={sending}
                type="primary"
                flex
                title="Next"
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
                title="Close"
                onPress={goToBack}
                style={[globalStyles.button, globalStyles.buttonLeft]}
                touchableStyles={globalStyles.buttonTouchable}
              />
            </GlobalLayout.Footer>
          </>
        )}
      </GlobalLayout>
    )
  );
};

export default withParams(withTranslation()(TokenSendPage));
