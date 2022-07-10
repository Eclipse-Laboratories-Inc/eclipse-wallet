import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import clipboard from '../../utils/clipboard';
import { createAccount, getDefaultChain } from '../../utils/wallet';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';
import GlobalDivider from '../../component-library/Global/GlobalDivider';

import Box from '../../component-library/Box/Box';
import TextArea from '../../component-library/Input/TextArea';
import TextInput from '../../component-library/Input/TextInput';

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

const Message = ({ onNext }) => (
  <>
    <GlobalPadding size="md" />

    <View style={styles.inner}>
      <GlobalDivider />

      <GlobalText type="headline2">Keep your seed safe!</GlobalText>

      <GlobalText type="body1">
        Your private keys are only stored on your current computer or device.
        You will need these words to restore your wallet if your browser's
        storage is cleared or your device is damaged or lost.
      </GlobalText>
    </View>

    <View style={styles.footerActions}>
      <GlobalButton type="primary" wide title="Continue" onPress={onNext} />
    </View>
  </>
);

const Form = ({ account, onComplete }) => (
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
      <GlobalText type="headline2">Your Seed Phrase</GlobalText>

      <GlobalText type="body1">
        Your private keys are only stored on your current computer or device.
        You will need these words to restore your wallet.
      </GlobalText>

      <GlobalPadding size="md" />

      <View style={styles.textAreaWrapper}>
        <TextArea lines={5} value={account.mnemonic} disabled />
      </View>
    </View>

    <View style={styles.footerActions}>
      <GlobalButton
        type="secondary"
        wide
        title="Copy Key"
        onPress={() => clipboard.copy(account.mnemonic)}
      />

      <GlobalPadding size="md" />

      <GlobalButton
        type="primary"
        wide
        title="I´ve backed up seed phrase"
        onPress={onComplete}
      />
    </View>
  </>
);

const ValidateSeed = ({ account, onComplete }) => {
  const [positions, setPositions] = useState([]);
  const [phrases, setPhrases] = useState(['', '', '']);
  useEffect(() => {
    const random = [2, 11, 22];
    setPositions(random);
  }, []);
  const isValid = useMemo(
    () =>
      positions.every(
        (pos, index) => phrases[index] === account.mnemonic.split(' ')[pos - 1],
      ),
    [positions, phrases, account],
  );
  const setPhrasePos = (value, index) =>
    setPhrases([
      ...[...phrases].splice(0, index),
      value,
      ...[...phrases].splice(index + 1, phrases.length),
    ]);
  return (
    <>
      <View style={styles.headerActions}>
        <View style={styles.pagination}>
          <GlobalPageDot />
          <GlobalPageDot active />
          <GlobalPageDot />
        </View>
      </View>

      <GlobalPadding size="md" />

      <View style={styles.inner}>
        <GlobalText type="headline2">Confirm Seed Phrase</GlobalText>

        <GlobalText type="body1">
          Prese re-enter seed phrase to confirm tha you have save it
        </GlobalText>

        <GlobalPadding size="md" />

        {positions.map((pos, index) => (
          <Box key={`phrase-${pos}`}>
            <TextInput
              label={pos}
              setValue={value => setPhrasePos(value, index)}
              value={phrases[index]}
            />
            <GlobalPadding size="md" />
          </Box>
        ))}
      </View>

      <View style={styles.footerActions}>
        <GlobalButton
          type={isValid ? 'primary' : 'secondary'}
          wide
          title="Continue"
          onPress={onComplete}
          disabled={!isValid}
        />
      </View>
    </>
  );
};

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
        <GlobalText type="headline2">Choose a Password</GlobalText>

        <GlobalText type="body1">
          Prese re-enter seed phrase to confirm tha you have save it
        </GlobalText>

        <GlobalPadding size="md" />

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
          type="secondary"
          wide
          title="Create Wallet"
          onPress={onContinue}
          disabled={!isValid}
        />
      </View>
    </>
  );
};

const CreateWallet = () => {
  const navigate = useNavigation();
  const [{ selectedEndpoints }, { addWallet }] = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    if (!account) {
      createAccount(
        // TODO: default chain should be the selected in previous step
        getDefaultChain(),
        selectedEndpoints[getDefaultChain()],
      ).then(d => {
        setAccount(d);
      });
    }
  }, [selectedEndpoints, account]);
  const handleOnPasswordComplete = async password => {
    await addWallet(account, password, getDefaultChain());
    navigate(ROUTES_MAP.WALLET);
  };
  return (
    <GlobalLayout>
      <View style={styles.container}>
        {step === 1 && <Message onNext={() => setStep(2)} />}
        {step === 2 && <Form account={account} onComplete={() => setStep(3)} />}
        {step === 3 && (
          <ValidateSeed account={account} onComplete={() => setStep(4)} />
        )}
        {step === 4 && <Password onComplete={handleOnPasswordComplete} />}
      </View>
    </GlobalLayout>
  );
};

export default CreateWallet;
