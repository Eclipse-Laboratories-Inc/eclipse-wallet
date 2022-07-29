import React, { useContext, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_ONBOARDING } from './routes';
import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';

import IconInteractionGreen from '../../assets/images/IconInteractionGreen.png';

import {
  getDefaultChain,
  recoverAccount,
  validateSeedPhrase,
} from '../../utils/wallet';

const styles = StyleSheet.create({
  bigIcon: {
    width: 120,
    height: 120,
  },
  divider: {
    marginVertical: theme.gutters.paddingXL,
    width: 56,
    height: 8,
  },
});

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

const Password = ({ onComplete, onBack, requiredLock, checkPassword }) => {
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');
  const [wrongpass, setWrongpass] = useState(false);
  const isValid =
    (!requiredLock && ((!!pass && pass === repass) || (!pass && !repass))) ||
    (requiredLock && pass);
  const onContinue = async () => {
    if (requiredLock) {
      const result = await checkPassword(pass);
      if (!result) {
        setWrongpass(true);
      } else {
        onComplete(pass);
      }
    } else {
      onComplete(pass);
    }
  };

  return (
    <>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack}>
          <View style={globalStyles.pagination}>
            <GlobalPageDot />
            <GlobalPageDot active />
            <GlobalPageDot />
          </View>
        </GlobalBackTitle>

        {requiredLock && (
          <>
            <GlobalText type="headline2" center>
              Insert password
            </GlobalText>
            <GlobalPadding size="2xl" />

            <GlobalInput
              placeholder="Password"
              value={pass}
              setValue={setPass}
              invalid={wrongpass}
              autoComplete="password-new"
              secureTextEntry
            />
          </>
        )}

        {!requiredLock && (
          <>
            <GlobalText type="headline2" center>
              Create Password
            </GlobalText>

            <GlobalText type="body1" center>
              3 lines max Excepteur sint occaecat cupidatat non proident, sunt
            </GlobalText>

            <GlobalPadding size="2xl" />

            <GlobalInput
              placeholder="New Password"
              value={pass}
              setValue={setPass}
              invalid={false}
              autoComplete="off"
              secureTextEntry
            />

            <GlobalPadding />

            <GlobalInput
              placeholder="Repeat New Password"
              value={repass}
              setValue={setRepass}
              invalid={false}
              autoComplete="off"
              secureTextEntry
            />
          </>
        )}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title="Recover Wallet"
          onPress={onContinue}
          disabled={!isValid}
        />
      </GlobalLayout.Footer>
    </>
  );
};

const Success = ({ goToWallet, goToDerived }) => (
  <>
    <GlobalLayout.Header>
      <GlobalPadding size="md" />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <GlobalPadding size="md" />

      <GlobalImage source={IconInteractionGreen} style={styles.bigIcon} />

      <GlobalPadding size="xl" />

      <GlobalText type="headline2" center>
        Success Message
      </GlobalText>

      <GlobalText type="body1" center>
        3 lines max Excepteur sint occaecat cupidatat non proident, sunt ?
      </GlobalText>
    </GlobalLayout.Inner>

    <GlobalLayout.Footer>
      <GlobalButton
        type="primary"
        wide
        title="Go to my Wallet"
        onPress={goToWallet}
      />

      <GlobalPadding size="md" />

      <GlobalButton
        type="secondary"
        wide
        title="Select Derivable"
        onPress={goToDerived}
      />
    </GlobalLayout.Footer>
  </>
);

const RecoverWallet = () => {
  const navigate = useNavigation();
  const [
    { selectedEndpoints, requiredLock, wallets },
    { addWallet, checkPassword },
  ] = useContext(AppContext);
  const [account, setAccount] = useState(null);
  const [step, setStep] = useState(1);
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
    await addWallet(account, password, getDefaultChain());
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

export default RecoverWallet;
