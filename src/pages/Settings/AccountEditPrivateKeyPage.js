import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getNetworks } from 'eclipse-wallet-adapter';

import { AppContext } from '../../AppProvider';
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
import CardButton from '../../component-library/CardButton/CardButton';

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
  sectionTitle: {
    flexDirection: 'row',
    marginBottom: theme.gutters.paddingSM,
  },
});

const PrivateKeyCard = ({ blockchainAccount, t }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const onReveal = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  return (
    <>
      <GlobalPadding size="lg" />
      <View style={styles.sectionTitle}>
        <GlobalText type="body1" color="secondary">
          {`${blockchainAccount.path}:`}
        </GlobalText>
      </View>
      <View style={[globalStyles.centered, styles.positionRelative]}>
        {!showPrivateKey && (
          <GlobalButton
            type="text"
            title={t(`settings.wallets.tap_to_reveal`)}
            onPress={onReveal}
            style={styles.floatingButton}
            touchableStyles={globalStyles.buttonTouchable}
            transparent
          />
        )}
        <GlobalInput
          value={
            showPrivateKey ? blockchainAccount.retrieveSecurePrivateKey() : ''
          }
          setValue={() => {}}
          seedphrase
          multiline
          numberOfLines={3}
          invalid={false}
          editable={false}
          inputGroupStyles={styles.inputGroupStyles}
          style={styles.textareaStyle}
        />
      </View>
      <GlobalPadding size="lg" />
    </>
  );
};

const AccountEditPrivateKeyPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ activeAccount }] = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [networks, setNetworks] = useState([]);
  const [networkId, setNetworkId] = useState();

  useEffect(() => {
    const load = async () => {
      setNetworks(await getNetworks());
    };

    load();
  }, []);

  const onBack = () => {
    if (step === 1) {
      navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, { id: params.id });
    } else {
      setStep(1);
    }
  };

  const onDone = () => {
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, { id: params.id });
  };

  const onSelect = id => {
    setNetworkId(id);
    setStep(2);
  };

  if (step === 1) {
    return (
      <GlobalLayout>
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={onBack}
            title={t(`settings.wallets.select_network`)}
          />
          {networks
            .filter(({ id }) => activeAccount.networksAccounts[id])
            .map(({ id, name, icon }) => (
              <CardButton
                key={id}
                title={name}
                image={icon}
                onPress={() => onSelect(id)}
              />
            ))}
        </GlobalLayout.Header>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`general.private_key`)} />

        <GlobalText type="body1" center>
          {t('settings.wallets.show_private_key_description')}
        </GlobalText>
        {activeAccount.networksAccounts[networkId].map(blockchainAccount => (
          <PrivateKeyCard
            key={blockchainAccount.path}
            blockchainAccount={blockchainAccount}
            t={t}
          />
        ))}
      </GlobalLayout.Header>

      <GlobalLayout.Footer inlineFlex>
        <GlobalButton
          type="primary"
          flex
          title={t(`actions.done`)}
          onPress={onDone}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditPrivateKeyPage));
