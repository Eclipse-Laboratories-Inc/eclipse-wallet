import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import { AppContext } from '../../AppProvider';
import clipboard from '../../utils/clipboard';
import { recoverAccount } from '../../utils/wallet';

const styles = StyleSheet.create({
  positionRelative: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroupStyles: {
    zIndex: -10,
  },
  textareaStyle: {
    backgroundColor: theme.colors.black100,
    borderColor: theme.colors.white200,
    textAlignVertical: 'bottom',
  },
  floatingButton: {
    position: 'absolute',
    zIndex: 100,
    top: 2,
    width: 265,
    height: 265,
  },
});

const AccountEditPrivateKeyPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ wallets, selectedEndpoints }] = useContext(AppContext);
  const [wallet, setWallet] = useState();
  useEffect(() => {
    const w = wallets.find(f => f.address === params.address);
    if (w) {
      recoverAccount(w.chain, w.mnemonic, selectedEndpoints[w.chain]).then(
        account => setWallet(account),
      );
    }
  }, [params.address, wallets, selectedEndpoints]);

  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, {
      address: params.address,
    });

  const goToCopy = () => clipboard.copy(wallet.retrieveSecurePrivateKey());

  const onReveal = () => {
    setShowSeedPhrase(!showSeedPhrase);
  };

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`general.private_key`)} />

        <GlobalText type="body1" center>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </GlobalText>

        <GlobalPadding size="lg" />

        <View style={[globalStyles.centered, styles.positionRelative]}>
          {!showSeedPhrase && (
            <GlobalButton
              type="text"
              title={
                !wallet
                  ? t(`general.loading`)
                  : t(`settings.wallets.tap_to_reveal`)
              }
              onPress={onReveal}
              style={styles.floatingButton}
              touchableStyles={globalStyles.buttonTouchable}
              transparent
              disabled={!wallet}
            />
          )}
          <GlobalInput
            value={
              showSeedPhrase && wallet ? wallet.retrieveSecurePrivateKey() : ''
            }
            setValue={() => {}}
            seedphrase
            multiline
            numberOfLines={8}
            invalid={false}
            editable={false}
            inputGroupStyles={styles.inputGroupStyles}
            style={styles.textareaStyle}
          />
        </View>
      </GlobalLayout.Header>

      <GlobalLayout.Footer inlineFlex>
        <GlobalButton
          type="secondary"
          flex
          title={t(`actions.copy`)}
          onPress={goToCopy}
          style={[globalStyles.button, globalStyles.buttonLeft]}
          touchableStyles={globalStyles.buttonTouchable}
          disabled={!showSeedPhrase}
        />

        <GlobalButton
          type="primary"
          flex
          title={t(`actions.done`)}
          onPress={onBack}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditPrivateKeyPage));
