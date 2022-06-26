import React, {useContext, useEffect, useMemo, useState} from 'react';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import TextArea from '../../component-library/Input/TextArea';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextParagraph from '../../component-library/Text/TextParagraph';
import TextTitle from '../../component-library/Text/TextTitle';
import {useNavigation} from '../../routes/hooks';
import {ROUTES_MAP} from '../../routes/app-routes';
import {createAccount, getDefaultChain} from '../../utils/wallet';
import clipboard from '../../utils/clipboard';
import Password from './components/Password';
import {AppContext} from '../../AppProvider';
import TextInput from '../../component-library/Input/TextInput';

const Message = ({onNext}) => (
  <>
    <Box px={10} py={10}>
      <TextTitle>Keep your seed safe!</TextTitle>
    </Box>
    <Box px={10} py={10}>
      <TextParagraph>
        Your private keys are only stored on your current computer or device.
        You will need these words to restore your wallet if your browser's
        storage is cleared or your device is damaged or lost.
      </TextParagraph>
    </Box>
    <Box px={10} py={10}>
      <Button onClick={onNext}>Continue</Button>
    </Box>
  </>
);

const Form = ({account, onComplete}) => (
  <>
    <Box px={10} py={10}>
      <TextTitle>Keep your seed safe!</TextTitle>
    </Box>
    <Box px={10} py={10}>
      <TextArea lines={5} value={account.mnemonic} disabled />
    </Box>
    <Box px={10} py={10}>
      <Button onClick={() => clipboard.copy(account.mnemonic)}>Copy Key</Button>
    </Box>
    <Box px={10} py={10}>
      <Button onClick={onComplete}>I've backed up my seed phrase</Button>
    </Box>
  </>
);

const ValidateSeed = ({account, onComplete}) => {
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
      <Box px={10} py={10}>
        <TextTitle>Confirm Seed Phrase</TextTitle>
      </Box>
      {positions.map((pos, index) => (
        <Box key={`phrase-${pos}`}>
          <TextInput
            label={pos}
            setValue={value => setPhrasePos(value, index)}
            value={phrases[index]}
          />
        </Box>
      ))}
      <Box px={10} py={10}>
        <Button onClick={onComplete} disabled={!isValid}>
          Continue
        </Button>
      </Box>
    </>
  );
};

const CreateWallet = () => {
  const navigate = useNavigation();
  const [{selectedEndpoints}, {addWallet}] = useContext(AppContext);
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
    <PageLayout>
      {step === 1 && <Message onNext={() => setStep(2)} />}
      {step === 2 && <Form account={account} onComplete={() => setStep(3)} />}
      {step === 3 && (
        <ValidateSeed account={account} onComplete={() => setStep(4)} />
      )}
      {step === 4 && <Password onComplete={handleOnPasswordComplete} />}
    </PageLayout>
  );
};

export default CreateWallet;
