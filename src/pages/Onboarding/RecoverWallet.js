import React, { useContext, useState, useMemo } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_ONBOARDING } from './routes';
import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';

import {
  getDefaultChain,
  recoverAccount,
  validateSeedPhrase,
} from '../../utils/wallet';
import Password from './components/Password';
import Success from './components/Success';

const Form = ({ onComplete, onBack }) => {
  const [seedPhrase, setSeedPhrase] = useState(
    'grow oblige neck same spend east come small dinosaur frost rice vintage',
  );

  const isValid = useMemo(() => validateSeedPhrase(seedPhrase), [seedPhrase]);

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

        <GlobalText type="headline2" center>
          Recover Existing Wallet
        </GlobalText>

        <GlobalText type="body1" center>
          Recover your wallet using your 24 words seed phrase.
        </GlobalText>

        <GlobalPadding size="xl" />

        <GlobalInput
          value={seedPhrase}
          setValue={setSeedPhrase}
          seedphrase
          multiline
          numberOfLines={8}
          invalid={false}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        {!isValid && (
          <GlobalButton
            type="secondary"
            wide
            title="Paste Seed Phrase"
            onPress={() => {}}
          />
        )}
        {!!isValid && (
          <GlobalButton
            type="primary"
            wide
            title="Next"
            onPress={() => onComplete(seedPhrase)}
          />
        )}
      </GlobalLayout.Footer>
    </>
  );
};

const RecoverWallet = ({ t }) => {
  const navigate = useNavigation();
  const [{ selectedEndpoints, requiredLock }, { addWallet, checkPassword }] =
    useContext(AppContext);
  const [account, setAccount] = useState(null);
  const [step, setStep] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const handleRecover = async seedPhrase => {
    const a = await recoverAccount(
      getDefaultChain(),
      seedPhrase,
      selectedEndpoints[getDefaultChain()],
    );
    setAccount(a);
    setStep(2);
  };
  const handleOnPasswordComplete = async password => {
    setWaiting(true);
    await addWallet(account, password, getDefaultChain());
    setWaiting(false);
    setStep(3);
  };
  const goToWallet = () => navigate(ROUTES_MAP.WALLET);
  const goToDerived = () => navigate(ROUTES_ONBOARDING.ONBOARDING_DERIVED);

  return (
    <GlobalLayout fullscreen>
      {step === 1 && (
        <Form
          onComplete={handleRecover}
          onBack={() => navigate(ROUTES_ONBOARDING.ONBOARDING_HOME)}
        />
      )}
      {step === 2 && (
        <Password
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
          goToWallet={goToWallet}
          goToDerived={goToDerived}
          onBack={() => setStep(2)}
        />
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(RecoverWallet);
