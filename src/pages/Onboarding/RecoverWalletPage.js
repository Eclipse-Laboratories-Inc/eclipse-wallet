import React, { useContext, useState, useMemo } from 'react';
import { View } from 'react-native';
import {
  AccountFactory,
  getNetworks,
  getTopTokensByPlatform,
  BLOCKCHAINS,
  PLATFORMS,
} from '4m-wallet-adapter';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_ONBOARDING } from './routes';
import { globalStyles } from '../../component-library/Global/theme';
import { isExtension } from '../../utils/platform';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';
import Logo from './components/Logo';
import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

import { validateSeedPhrase } from '../../utils/wallet';
import Password from './components/Password';
import Success from './components/Success';
import clipboard from '../../utils/clipboard.native';

const Form = ({ waiting, onComplete, onBack, t }) => {
  const [seedPhrase, setSeedPhrase] = useState('');

  const isValid = useMemo(() => validateSeedPhrase(seedPhrase), [seedPhrase]);
  const onPaste = async () => {
    const seed = await clipboard.paste();
    setSeedPhrase(seed);
  };
  return (
    <>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack}>
          <View style={globalStyles.pagination}>
            <GlobalPageDot active />
            <GlobalPageDot />
            <GlobalPageDot />
          </View>
        </GlobalBackTitle>
        <Logo size={isExtension() ? 'sm' : null} />

        <GlobalPadding size={isExtension() ? 'lg' : '2xl'} />

        <GlobalText type="headline2" center>
          {t('wallet.recover.messageTitle')}
        </GlobalText>

        <GlobalText type="body1" center>
          {t('wallet.recover.messageBody')}
        </GlobalText>

        <GlobalPadding size="xl" />

        <GlobalInput
          value={seedPhrase}
          setValue={setSeedPhrase}
          seedphrase
          multiline
          numberOfLines={4}
          autoFocus={true}
          invalid={false}
          editable={!waiting}
          onEnter={() => isValid && onComplete(seedPhrase)}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.recover.pasteSeed')}
          onPress={onPaste}
          disabled={waiting}
        />
        <GlobalPadding size="md" />
        {!!isValid && (
          <GlobalButton
            type="primary"
            wide
            title={t('actions.next')}
            onPress={() => onComplete(seedPhrase)}
            disabled={waiting}
          />
        )}
      </GlobalLayout.Footer>
    </>
  );
};

const RecoverWalletPage = ({ t }) => {
  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.RECOVER_WALLET);
  const navigate = useNavigation();
  const [
    { counter, requiredLock, isAdapter },
    { addAccount, checkPassword, importTokens },
  ] = useContext(AppContext);
  const [account, setAccount] = useState(null);
  const [step, setStep] = useState(1);
  const [waiting, setWaiting] = useState(false);

  const handleRecover = async seedPhrase => {
    setWaiting(true);
    const name = t('wallet.name_template', { number: counter + 1 });
    const mnemonic = seedPhrase.trim();
    const newAccount = await AccountFactory.create({ name, mnemonic });
    setWaiting(false);
    setAccount(newAccount);
    trackEvent(EVENTS_MAP.SECRET_RECOVERED);
    setStep(2);
  };
  const handleOnPasswordComplete = async password => {
    setWaiting(true);
    try {
      const networks = (await getNetworks()).filter(
        ({ blockchain, environment }) =>
          blockchain === BLOCKCHAINS.ETHEREUM && environment === 'mainnet',
      );
      if (networks.length > 0) {
        const tokens = await getTopTokensByPlatform(PLATFORMS.ETHEREUM);
        for (const network of networks) {
          await importTokens(network.id, tokens);
        }
      }
    } catch (e) {
      console.error('Could not import tokens', e);
    }
    await addAccount(account, password);
    setWaiting(false);
    trackEvent(EVENTS_MAP.PASSWORD_COMPLETED);
    setStep(3);
  };
  const goToWallet = () => {
    trackEvent(EVENTS_MAP.RECOVER_COMPLETED);
    navigate(ROUTES_MAP.WALLET);
  };
  const goToAdapter = () => {
    trackEvent(EVENTS_MAP.RECOVER_COMPLETED);
    navigate(ROUTES_MAP.ADAPTER);
  };
  const goToDerived = () => navigate(ROUTES_ONBOARDING.ONBOARDING_DERIVED);

  return (
    <GlobalLayout fullscreen>
      {step === 1 && (
        <Form
          waiting={waiting}
          onComplete={handleRecover}
          onBack={() =>
            navigate(
              isAdapter
                ? ROUTES_MAP.ADAPTER
                : ROUTES_ONBOARDING.ONBOARDING_HOME,
            )
          }
          t={t}
        />
      )}
      {step === 2 && (
        <Password
          type="recover"
          onComplete={handleOnPasswordComplete}
          onBack={() => setStep(1)}
          requiredLock={requiredLock}
          checkPassword={checkPassword}
          waiting={waiting}
          t={t}
        />
      )}
      {step === 3 && (
        <Success
          goToWallet={!isAdapter ? goToWallet : undefined}
          goToAdapter={isAdapter ? goToAdapter : undefined}
          goToDerived={goToDerived}
          onBack={() => setStep(2)}
          t={t}
        />
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(RecoverWalletPage);
