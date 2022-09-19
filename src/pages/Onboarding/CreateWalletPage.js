import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import randomNumber from 'lodash/random';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from './routes';
import { ROUTES_MAP as ADAPTER_ROUTES_MAP } from '../Adapter/routes';
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
import GlobalToast from '../../component-library/Global/GlobalToast';

import Password from './components/Password';
import Success from './components/Success';
import Logo from './components/Logo';

const Message = ({ onNext, onBack, waiting, t }) => (
  <>
    <GlobalLayout.Header>
      <GlobalBackTitle onBack={onBack} />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <Logo />

      <GlobalPadding size="2xl" />

      <GlobalDivider />

      <GlobalText type="headline2" center>
        {t('wallet.create.messageTitle')}
      </GlobalText>

      <GlobalText type="body1" center>
        {t('wallet.create.messageBody')}
      </GlobalText>
    </GlobalLayout.Inner>

    <GlobalPadding size="4xl" />
    <GlobalPadding size="4xl" />

    <GlobalLayout.Footer>
      <GlobalButton
        type="primary"
        wide
        title={
          !waiting ? t('actions.start') : t('wallet.create.buttonPreparing')
        }
        onPress={onNext}
        disabled={waiting}
      />
    </GlobalLayout.Footer>
  </>
);

const Form = ({ account, onComplete, onBack, t }) => {
  const [showToast, setShowToast] = useState(false);
  const onCopySeed = () => {
    clipboard.copy(account.mnemonic);
    setShowToast(true);
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

        <Logo />

        <GlobalPadding size="2xl" />

        <GlobalText type="headline2" center>
          {t('wallet.create.your_seed_phrase')}
        </GlobalText>

        <GlobalText type="body1" center>
          {t('wallet.create.your_seed_phrase_body')}
        </GlobalText>

        <GlobalPadding size="xl" />

        <GlobalInput
          value={account.mnemonic}
          readonly
          seedphrase
          multiline
          numberOfLines={4}
          invalid={false}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.create.copy_key')}
          onPress={onCopySeed}
        />
        <GlobalToast
          message={t('wallet.copied')}
          open={showToast}
          setOpen={setShowToast}
        />

        <GlobalPadding size="md" />

        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create.ive_backed_up_seed_phrase')}
          onPress={onComplete}
        />
      </GlobalLayout.Footer>
    </>
  );
};

const ValidateSeed = ({ account, onComplete, onBack, t }) => {
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

        <Logo />

        <GlobalPadding size="2xl" />

        <GlobalText type="headline2" center>
          {t('wallet.create.confirm_seed_phrase')}
        </GlobalText>

        <GlobalText type="body1" center>
          {t('wallet.create.confirm_seed_phrase_body')}
        </GlobalText>

        <GlobalPadding size="2xl" />

        {positions.map((pos, index) => (
          <React.Fragment key={`phrase-${pos}`}>
            <GlobalInput
              startLabel={pos}
              placeholder={t(`wallet.create.enter_word_number`) + pos}
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
          type="primary"
          wide
          title={t('actions.next')}
          onPress={onComplete}
          disabled={isValid}
        />
      </GlobalLayout.Footer>
    </>
  );
};

const CreateWalletPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [
    { selectedEndpoints, requiredLock, isAdapter },
    { addWallet, checkPassword },
  ] = useContext(AppContext);
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
  const goToWallet = () =>
    navigate(
      isAdapter ? ADAPTER_ROUTES_MAP.ADAPTER_DETAIL : APP_ROUTES_MAP.WALLET,
    );
  const goToDerived = () => navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_DERIVED);

  return (
    <GlobalLayout fullscreen>
      {step === 1 && (
        <Message
          onNext={onAddAccount}
          onBack={() =>
            navigate(
              isAdapter
                ? APP_ROUTES_MAP.ADAPTER
                : ONBOARDING_ROUTES_MAP.ONBOARDING_HOME,
            )
          }
          waiting={waiting}
          t={t}
        />
      )}
      {step === 2 && (
        <Form
          account={account}
          onComplete={() => setStep(3)}
          onBack={() => setStep(1)}
          t={t}
        />
      )}
      {step === 3 && (
        <ValidateSeed
          account={account}
          onComplete={() => setStep(4)}
          onBack={() => setStep(2)}
          t={t}
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
          t={t}
        />
      )}
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(CreateWalletPage));
