import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import randomNumber from 'lodash/random';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import clipboard from '../../utils/clipboard';
import { createAccount } from '../../utils/wallet';
import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';
import GlobalDivider from '../../component-library/Global/GlobalDivider';
import { withTranslation } from '../../hooks/useTranslations';
import Password from './components/Password';
import Success from './components/Success';

const Message = ({ onNext, onBack, waiting, t }) => (
  <>
    <GlobalLayout.Header>
      <GlobalBackTitle onBack={onBack} />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <GlobalDivider />

      <GlobalText type="headline2" center>
        {t('wallet.create.messageTitle')}
      </GlobalText>

      <GlobalText type="body1" center>
        {t('wallet.create.messageBody1')}
        {t('wallet.create.messageBody2')}
        {t('wallet.create.messageBody3')}
      </GlobalText>
    </GlobalLayout.Inner>

    <GlobalLayout.Footer>
      <GlobalButton
        type="primary"
        wide
        title={
          !waiting
            ? t('wallet.create.buttonContinue')
            : t('wallet.create.buttonPreparing')
        }
        onPress={onNext}
        disabled={waiting}
      />
    </GlobalLayout.Footer>
  </>
);

const Form = ({ account, onComplete, onBack }) => (
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
        Your Seed Phrase
      </GlobalText>

      <GlobalText type="body1" center>
        Your private keys are only stored on your current computer or device.
        You will need these words to restore your wallet.
      </GlobalText>

      <GlobalPadding size="xl" />

      <GlobalInput
        value={account.mnemonic}
        readonly
        seedphrase
        multiline
        numberOfLines={8}
        invalid={false}
      />
    </GlobalLayout.Header>

    <GlobalLayout.Footer>
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
    </GlobalLayout.Footer>
  </>
);

const ValidateSeed = ({ account, onComplete, onBack }) => {
  const [positions, setPositions] = useState([]);
  const [phrases, setPhrases] = useState(['', '', '']);
  useEffect(() => {
    const length = account.mnemonic.split(' ').length;
    const random = [
      randomNumber(1, Math.floor(length / 3)),
      randomNumber(Math.floor(length / 3) + 1, Math.floor(length / 3) * 2),
      randomNumber(Math.floor(length / 3) * 2 + 1, length),
    ];
    setPositions(random);
  }, [account]);
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
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack}>
          <View style={globalStyles.pagination}>
            <GlobalPageDot />
            <GlobalPageDot active />
            <GlobalPageDot />
          </View>
        </GlobalBackTitle>

        <GlobalText type="headline2" center>
          Confirm Seed Phrase
        </GlobalText>

        <GlobalText type="body1" center>
          Prese re-enter seed phrase to confirm tha you have save it
        </GlobalText>

        <GlobalPadding size="2xl" />

        {positions.map((pos, index) => (
          <React.Fragment key={`phrase-${pos}`}>
            <GlobalInput
              startLabel={pos}
              placeholder={'Enter Word #' + pos}
              setValue={value => setPhrasePos(value, index)}
              // value={phrases[index]}
              value={account.mnemonic.split(' ')[pos - 1]}
              invalid={false}
            />
            <GlobalPadding />
          </React.Fragment>
        ))}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type={isValid ? 'primary' : 'secondary'}
          wide
          title="Continue"
          onPress={onComplete}
          disabled={isValid}
        />
      </GlobalLayout.Footer>
    </>
  );
};

const CreateWallet = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ selectedEndpoints, requiredLock }, { addWallet, checkPassword }] =
    useContext(AppContext);
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const onAddAccount = () => {
    setWaiting(true);
    if (!account) {
      createAccount(params.chainCode, selectedEndpoints[params.chainCode]).then(
        d => {
          setAccount(d);
          setStep(2);
          setWaiting(false);
        },
      );
    } else {
      setStep(2);
      setWaiting(false);
    }
  };
  const handleOnPasswordComplete = async password => {
    setWaiting(true);
    await addWallet(account, password, params.chainCode);
    setStep(5);
  };
  const goToWallet = () => navigate(APP_ROUTES_MAP.WALLET);
  const goToDerived = () => navigate(ROUTES_MAP.ONBOARDING_DERIVED);

  return (
    <GlobalLayout fullscreen>
      {step === 1 && (
        <Message
          onNext={onAddAccount}
          onBack={() => navigate(ROUTES_MAP.ONBOARDING_HOME)}
          waiting={waiting}
          t={t}
        />
      )}
      {step === 2 && (
        <Form
          account={account}
          onComplete={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ValidateSeed
          account={account}
          onComplete={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Password
          onComplete={handleOnPasswordComplete}
          onBack={() => setStep(3)}
          requiredLock={requiredLock}
          checkPassword={checkPassword}
          waiting={waiting}
          t={t}
        />
      )}
      {step === 5 && (
        <Success
          goToWallet={goToWallet}
          goToDerived={goToDerived}
          onBack={() => setStep(2)}
        />
      )}
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(CreateWallet));
