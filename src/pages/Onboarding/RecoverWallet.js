import React, {useState} from 'react';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import TextArea from '../../component-library/Input/TextArea';
import TextInput from '../../component-library/Input/TextInput';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextTitle from '../../component-library/Text/TextTitle';

const Form = ({seedPhrase, setSeedPhrase, onComplete}) => {
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');

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
        <TextInput label="Password" value={pass} setValue={setPass} />
      </Box>
      <Box px={10} py={10}>
        <TextInput label="Re Password" value={repass} setValue={setRepass} />
      </Box>
      <Box px={10} py={10}>
        <Button onClick={() => onComplete()}>Continue</Button>
      </Box>
    </>
  );
};

const SelectAccounts = () => {
  return <></>;
};

const RecoverWallet = () => {
  const [step, setStep] = useState(1);
  const [seedPhrase, setSeedPhrase] = useState('');
  return (
    <PageLayout>
      {step === 1 && (
        <Form
          seedPhrase={seedPhrase}
          setSeedPhrase={setSeedPhrase}
          onComplete={() => setStep(2)}
        />
      )}
      {step === 2 && <SelectAccounts onComplete={() => setStep(0)} />}
    </PageLayout>
  );
};

export default RecoverWallet;
