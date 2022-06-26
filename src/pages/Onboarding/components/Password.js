import React, {useState} from 'react';
import Box from '../../../component-library/Box/Box';
import Button from '../../../component-library/Button/Button';
import TextInput from '../../../component-library/Input/TextInput';

const Password = ({onComplete}) => {
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');
  const isValid = (!!pass && pass === repass) || (!pass && !repass);
  const onContinue = () => {
    onComplete(pass);
  };

  return (
    <>
      <Box px={10} py={10}>
        <TextInput label="Password" value={pass} setValue={setPass} />
      </Box>
      <Box px={10} py={10}>
        <TextInput label="Re Password" value={repass} setValue={setRepass} />
      </Box>
      <Box px={10} py={10}>
        <Button onClick={onContinue} disabled={!isValid}>
          Continue
        </Button>
      </Box>
    </>
  );
};

export default Password;
