import React, {useEffect, useState} from 'react';
import {createAccount} from '@4m/wallet-adapter';
import {generateMnemonicAndSeed} from '@4m/wallet-adapter/services/seed-service';
import chains from '@4m/wallet-adapter/constants/chains';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import FormDialog from '../../component-library/Dialog/FormDialog';
import TextArea from '../../component-library/Input/TextArea';
import TextInput from '../../component-library/Input/TextInput';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextParagraph from '../../component-library/Text/TextParagraph';
import TextTitle from '../../component-library/Text/TextTitle';
import {useNavigation} from '../../routes/hooks';
import {ROUTES_MAP} from '../../routes/app-routes';

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

const Form = ({seedPhrase, setSeedPhrase, onComplete}) => {
  const [data, setData] = useState({});
  useEffect(() => {
    generateMnemonicAndSeed().then(d => {
      setData(d);
    });
  }, []);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Box px={10} py={10}>
        <TextTitle>Keep your seed safe!</TextTitle>
      </Box>
      <Box px={10} py={10}>
        <TextArea lines={5} value={data.mnemonic} disabled />
      </Box>
      <Box px={10} py={10}>
        <Button>Download Key</Button>
      </Box>
      <Box px={10} py={10}>
        <Button onClick={() => setShowModal(true)}>Continue</Button>
      </Box>
      <FormDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          setShowModal(false);
          onComplete();
        }}
        title="Check"
        text="Text"
        labelCancel="Cancel"
        labelSubmit="Continue">
        <TextArea
          label="Seed Words"
          lines={5}
          value={seedPhrase}
          setValue={setSeedPhrase}
        />
      </FormDialog>
    </>
  );
};

const Password = ({onComplete}) => {
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');
  return (
    <>
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

const CreateWallet = () => {
  const navigate = useNavigation();
  const [step, setStep] = useState(1);
  const handleOnPasswordComplete = async () => {
    const account = await createAccount(chains.SOLANA, {
      endpoint: 'https://solana-api.projectserum.com/',
    });
    const tokens = await account.getTokens();
    console.log(tokens);
    navigate(ROUTES_MAP.WALLET);
  };
  return (
    <PageLayout>
      {step === 1 && <Message onNext={() => setStep(2)} />}
      {step === 2 && <Form onComplete={() => setStep(3)} />}
      {step === 3 && <Password onComplete={() => handleOnPasswordComplete()} />}
    </PageLayout>
  );
};
export default CreateWallet;
