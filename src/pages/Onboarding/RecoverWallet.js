import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../AppProvider';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import TextArea from '../../component-library/Input/TextArea';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextTitle from '../../component-library/Text/TextTitle';
import { ROUTES_MAP } from '../../routes/app-routes';
import { useNavigation } from '../../routes/hooks';
import {
  getDefaultChain,
  recoverAccount,
  validateSeedPhrase,
} from '../../utils/wallet';
import Password from './components/Password';
import { ROUTES_MAP as ROUTES_ONBOARDING } from './routes';

const Form = ({ onComplete }) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const isValid = useMemo(() => validateSeedPhrase(seedPhrase), [seedPhrase]);
  return (
    <>
      <Box px={10} py={10}>
        <TextTitle>Recover your wallet from your seed phrase</TextTitle>
      </Box>
      <Box px={10} py={10}>
        <TextArea
          label="Seed Words"
          lines={5}
          value={seedPhrase}
          setValue={setSeedPhrase}
        />
      </Box>
      <Box px={10} py={10}>
        <Button onClick={() => onComplete(seedPhrase)} disabled={!isValid}>
          Continue
        </Button>
      </Box>
    </>
  );
};

const Success = ({ goToWallet, goToDerived }) => (
  <>
    <Box>
      <TextTitle>Success</TextTitle>
    </Box>
    <Box>
      <Button onClick={goToWallet}>Go to my Wallet</Button>
      <Button onClick={goToDerived}>Select Derivable</Button>
    </Box>
  </>
);

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
    <PageLayout>
      {step === 1 && <Form onComplete={handleRecover} />}
      {step === 2 && <Password onComplete={handleOnPasswordComplete} />}
      {step === 3 && (
        <Success goToWallet={goToWallet} goToDerived={goToDerived} />
      )}
    </PageLayout>
  );
};

export default RecoverWallet;
