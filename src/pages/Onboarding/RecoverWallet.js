import React, { useContext, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_ONBOARDING } from './routes';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';

import IconTransactionsMark from '../../assets/images/IconTransactionsMark.png';

import {
  getDefaultChain,
  recoverAccount,
  validateSeedPhrase,
} from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: theme.gutters.paddingSM,
    paddingVertical: 40,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
    minHeight: '100%',
  },
  headerActions: {
    width: '100%',
  },
  inner: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.gutters.paddingNormal,
    paddingBottom: theme.gutters.padding2XL,
  },
  footerActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigIcon: {
    width: 120,
    height: 120,
  },
  divider: {
    marginVertical: theme.gutters.paddingXL,
    width: 56,
    height: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textAreaWrapper: {
    width: '100%',
    height: 284,
  },
  inputWrapper: {
    width: '90%',
  },
});

const Form = ({ onComplete, onBack }) => {
  const [seedPhrase, setSeedPhrase] = useState('');

  const isValid = useMemo(() => validateSeedPhrase(seedPhrase), [seedPhrase]);

  return (
    <>
      <View style={styles.headerActions}>
        <GlobalBackTitle onBack={() => onBack()}>
          <View style={styles.pagination}>
            <GlobalPageDot active />
            <GlobalPageDot />
            <GlobalPageDot />
          </View>
        </GlobalBackTitle>
      </View>

      <View style={styles.inner}>
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
          complete={false}
          invalid={false}
        />
      </View>
      <View style={styles.footerActions}>
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
      </View>
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
      <View style={styles.headerActions}>
        <GlobalBackTitle onBack={() => onBack()}>
          <View style={styles.pagination}>
            <GlobalPageDot />
            <GlobalPageDot active />
            <GlobalPageDot />
          </View>
        </GlobalBackTitle>
      </View>
      {requiredLock && (
        <View style={styles.inner}>
          <GlobalText type="headline2" center>
            Insert password
          </GlobalText>
          <GlobalPadding size="2xl" />

          <GlobalInput
            placeholder="Password"
            value={pass}
            setValue={setPass}
            complete={false}
            invalid={wrongpass}
            autoComplete="password-new"
          />
        </View>
      )}
      {!requiredLock && (
        <View style={styles.inner}>
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
            complete={false}
            invalid={false}
            autoComplete="password-new"
            secureTextEntry
          />

          <GlobalPadding />

          <GlobalInput
            placeholder="Repeat New Password"
            value={repass}
            setValue={setRepass}
            complete={false}
            invalid={false}
            autoComplete="password-new"
            secureTextEntry
          />
        </View>
      )}
      <View style={styles.footerActions}>
        <GlobalButton
          type="primary"
          wide
          title="Recover Wallet"
          onPress={onContinue}
          disabled={!isValid}
        />
      </View>
    </>
  );
};

const Success = ({ goToWallet, goToDerived }) => (
  <>
    <View style={styles.headerActions}>
      <GlobalPadding size="md" />
    </View>

    <View style={styles.inner}>
      <GlobalPadding size="md" />

      <GlobalImage source={IconTransactionsMark} style={styles.bigIcon} />

      <GlobalPadding size="xl" />

      <GlobalText type="headline2" center>
        Success Message
      </GlobalText>

      <GlobalText type="body1" center>
        3 lines max Excepteur sint occaecat cupidatat non proident, sunt ?
      </GlobalText>
    </View>

    <View style={styles.footerActions}>
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
    </View>
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
    <GlobalLayout>
      <View style={styles.container}>
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
      </View>
    </GlobalLayout>
  );
};

export default RecoverWallet;
