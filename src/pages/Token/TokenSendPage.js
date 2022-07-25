import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';

import { LOGOS, getTransactionImage } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

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
  addressBookItem: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 60,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: theme.variables.buttonMaxWidthSmall,
  },
  bigImage: {
    backgroundColor: theme.colors.bgLight,
  },
  buttonTouchable: {
    flex: 1,
  },
  button: {
    alignSelf: 'stretch',
  },
  buttonLeft: {
    marginRight: theme.gutters.paddingXS,
  },
  buttonRight: {
    marginLeft: theme.gutters.paddingXS,
  },
  inlineWell: {
    marginBottom: theme.gutters.paddingXS,
    paddingVertical: theme.gutters.paddingXS,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.buttonMaxWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusMD,
  },
});

const TokenSendPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);
  const [token, setToken] = useState({});

  const [{ activeWallet }] = useContext(AppContext);

  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientAmount, setRecipientAmount] = useState('');

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        const tokenSelected = (balance.items || []).find(
          i => i.address === params.tokenId,
        );
        setToken(tokenSelected || {});
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(ROUTES_MAP.WALLET);
  };

  const onSend = () => {
    navigate(ROUTES_MAP.WALLET);
  };

  const addressBook = [
    {
      chain: 'SOLANA',
      name: 'Demo Name 1',
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
      address: '8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtzi',
    },
    {
      chain: 'SOLANA',
      name: 'Demo Name 2',
      logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      address: 'So11111111111111111111111111111111111111112',
    },
  ];

  return (
    loaded && (
      <GlobalLayout withContainer>
        <View style={globalStyles.mainHeader}>
          <GlobalBackTitle
            onBack={goToBack}
            title={`${t('token.action.send')} SOL`}
            nospace
          />

          <CardButtonWallet
            title="From: Wallet Name"
            address={activeWallet.getReceiveAddress()}
            chain="SOLANA"
            imageSize="md"
            buttonStyle={styles.buttonStyle}
            touchableStyles={styles.touchableStyles}
            transparent
            readonly
          />

          <GlobalInputWithButton
            startLabel="To"
            placeholder={`Name or ${'SOL'} Address`}
            value={recipientAddress}
            setValue={setRecipientAddress}
            actionIcon="qr"
            onActionPress={() => {}}
          />

          <GlobalPadding />

          <GlobalCollapse
            title="Address Book"
            titleStyle={styles.titleStyle}
            isOpen
            hideCollapse>
            {addressBook.map(addressBookItem => (
              <CardButtonWallet
                title={addressBookItem.name}
                address={addressBookItem.address}
                chain={addressBookItem.chain}
                imageSize="md"
                onPress={() => {}}
                buttonStyle={styles.addressBookItem}
                touchableStyles={styles.touchableStyles}
                transparent
              />
            ))}
          </GlobalCollapse>

          <GlobalPadding size="4xl" />

          <GlobalInputWithButton
            startLabel="SOL"
            placeholder="Enter Amount"
            value={recipientAmount}
            setValue={setRecipientAmount}
            keyboardType="numeric"
            actionIcon="sendmax"
            onActionPress={() => {}}
          />

          <GlobalPadding />

          <GlobalText type="subtitle2" center>
            -0 USD
          </GlobalText>

          <GlobalPadding size="md" />

          <GlobalText type="body1" center>
            2 lines max Validation text sint occaecat cupidatat non proident
          </GlobalText>

          <GlobalPadding size="4xl" />

          <View style={styles.centered}>
            <GlobalImage
              source={getMediaRemoteUrl(LOGOS['SOLANA'])}
              size="xxl"
              style={styles.bigImage}
              circle
            />

            <GlobalText type="headline1" center>
              16.000 SOL
            </GlobalText>

            <GlobalPadding size="md" />

            <GlobalText type="subtitle2" center>
              Name.SOL
            </GlobalText>

            <GlobalPadding size="md" />

            <View style={styles.inlineWell}>
              <GlobalText type="body2">Name.SOL</GlobalText>

              <GlobalButton onPress={() => {}} transparent>
                <GlobalImage source={IconCopy} size="xs" />
              </GlobalButton>
            </View>

            <View style={styles.inlineWell}>
              <GlobalText type="caption" color="tertiary">
                Network Fee
              </GlobalText>

              <GlobalText type="body2">$ 8.888.16</GlobalText>
            </View>
          </View>

          <GlobalPadding size="4xl" />
          <GlobalPadding size="4xl" />

          <View style={styles.centeredSmall}>
            <GlobalImage
              source={getTransactionImage('success')}
              size="3xl"
              circle
            />
            <GlobalPadding />
            <GlobalText type="headline2" center>
              Sent
            </GlobalText>
            <GlobalText type="body1" center>
              3 lines max Excepteur sint occaecat cupidatat non proident, sunt ?
            </GlobalText>

            <GlobalPadding size="4xl" />

            <GlobalImage
              source={getTransactionImage('fail')}
              size="3xl"
              circle
            />
            <GlobalPadding />
            <GlobalText type="headline2" center>
              Fail
            </GlobalText>
            <GlobalText type="body1" center>
              3 lines max Excepteur sint occaecat cupidatat non proident, sunt ?
            </GlobalText>

            <GlobalPadding size="4xl" />

            <GlobalImage
              source={getTransactionImage('warning')}
              size="3xl"
              circle
            />
            <GlobalPadding />
            <GlobalText type="headline2" center>
              Warning
            </GlobalText>
            <GlobalText type="body1" center>
              3 lines max Excepteur sint occaecat cupidatat non proident, sunt ?
            </GlobalText>
          </View>
        </View>

        <View style={globalStyles.mainFooter}>
          <View style={globalStyles.inlineFlexButtons}>
            <GlobalButton
              type="secondary"
              flex
              title="Cancel"
              onPress={goToBack}
              style={[styles.button, styles.buttonLeft]}
              touchableStyles={styles.buttonTouchable}
            />

            <GlobalButton
              type="primary"
              flex
              title="Next"
              onPress={onSend}
              style={[styles.button, styles.buttonRight]}
              touchableStyles={styles.buttonTouchable}
            />
          </View>
        </View>
      </GlobalLayout>
    )
  );
};

export default withParams(withTranslation()(TokenSendPage));
