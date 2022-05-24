import React, {useState} from 'react';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import TextArea from '../../component-library/Input/TextArea';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextParagraph from '../../component-library/Text/TextParagraph';
import TextTitle from '../../component-library/Text/TextTitle';

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

const Form = ({seedPhrase, setSeedPhrase}) => (
  <>
    <Box px={10} py={10}>
      <TextTitle>Keep your seed safe!</TextTitle>
    </Box>
    <Box px={10} py={10}>
      <TextArea
        label="Seed Words"
        lines={5}
        value={seedPhrase}
        setValue={setSeedPhrase}
        disabled={true}
      />
    </Box>
    <Box px={10} py={10}>
      <Button>Download Key</Button>
    </Box>
  </>
);

const CreateWallet = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [seedPhrase, setSeedPhrase] = useState(
    'asd asd asdas asd asd asd asd asd asd asd asd',
  );
  return (
    <PageLayout>
      {showMessage && <Message onNext={() => setShowMessage(false)} />}
      {!showMessage && (
        <Form seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} />
      )}
    </PageLayout>
  );
};
export default CreateWallet;
