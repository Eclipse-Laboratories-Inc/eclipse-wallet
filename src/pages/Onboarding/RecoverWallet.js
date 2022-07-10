import React, { useContext, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_ONBOARDING } from './routes';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';

import IconTransactionsMark from '../../assets/images/IconTransactionsMark.png';

import TextArea from '../../component-library/Input/TextArea';
import TextInput from '../../component-library/Input/TextInput';

import {
  getDefaultChain,
  recoverAccount,
  validateSeedPhrase,
} from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: theme.gutters.paddingSM,
    paddingVertical: 40,
    maxWidth: theme.variables.mobileWidth,
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
    maxWidth: 375,
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

const Form = ({ onComplete }) => {
  const [seedPhrase, setSeedPhrase] = useState(
    'dilemma usage defy sad adapt balcony olive obey glare pole push surprise risk useful calm ketchup mouse side bulb race hole excess finger address',
  );
  const isValid = useMemo(() => validateSeedPhrase(seedPhrase), [seedPhrase]);

  return (
    <>
      <View style={styles.headerActions}>
        <View style={styles.pagination}>
          <GlobalPageDot active />
          <GlobalPageDot />
          <GlobalPageDot />
        </View>
      </View>

      <GlobalPadding size="md" />

      <View style={styles.inner}>
        <GlobalText type="headline2" center>
          Recover Existing Wallet
        </GlobalText>

        <GlobalText type="body1" center>
          Recover your wallet using your 24 words seed phrase.
        </GlobalText>

        <GlobalPadding size="xl" />

        <View style={styles.textAreaWrapper}>
          <TextArea
            label="Seed Words"
            lines={5}
            value={seedPhrase}
            setValue={setSeedPhrase}
          />
        </View>
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

const Password = ({ onComplete }) => {
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');
  const isValid = (!!pass && pass === repass) || (!pass && !repass);
  const onContinue = () => {
    onComplete(pass);
  };

  return (
    <>
      <View style={styles.headerActions}>
        <View style={styles.pagination}>
          <GlobalPageDot />
          <GlobalPageDot />
          <GlobalPageDot active />
        </View>
      </View>

      <View style={styles.inner}>
        <GlobalPadding size="md" />

        <GlobalText type="headline2" center>
          Create Password
        </GlobalText>

        <GlobalText type="body1" center>
          3 lines max Excepteur sint occaecat cupidatat non proident, sunt
        </GlobalText>

        <GlobalPadding size="xl" />

        <View style={styles.inputWrapper}>
          <TextInput label="New Password" value={pass} setValue={setPass} />
        </View>

        <GlobalPadding size="md" />

        <View style={styles.inputWrapper}>
          <TextInput
            label="Repeat New Password"
            value={repass}
            setValue={setRepass}
          />
        </View>
      </View>

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

const RecoverWallet = () => {
  const navigate = useNavigation();
  const [{ selectedEndpoints }, { addWallet }] = useContext(AppContext);
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
        {step === 1 && <Form onComplete={handleRecover} />}
        {step === 2 && <Password onComplete={handleOnPasswordComplete} />}
        {step === 3 && (
          <Success goToWallet={goToWallet} goToDerived={goToDerived} />
        )}
      </View>
    </GlobalLayout>
  );
};

export default RecoverWallet;
