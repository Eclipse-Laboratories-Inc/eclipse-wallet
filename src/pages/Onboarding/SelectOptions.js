import React, { useState } from 'react';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import Image from '../../component-library/Image/Image';
import PageLayout from '../../component-library/Layout/PageLayout';
import BasicSelect from '../../component-library/Selects/BasicSelect';
import TextTitle from '../../component-library/Text/TextTitle';
import Logo from '../../images/logo.png';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';

const SelectOptions = () => {
  const navigate = useNavigation();
  const [chainCode, setChainCode] = useState('');
  return (
    <PageLayout>
      <Box px={10} py={10}>
        <Image src={Logo} alt="logo" />
      </Box>
      <Box px={10} py={10}>
        <TextTitle>Welcome</TextTitle>
      </Box>
      <Box px={10} py={10}>
        <BasicSelect
          value={chainCode}
          setValue={setChainCode}
          label="Chain"
          options={[{ value: 'SOLANA', label: 'Solana' }]}
        />
      </Box>
      <Box px={10} py={10}>
        <Button
          onClick={() => navigate(ROUTES_MAP.ONBOARDING_CREATE)}
          disabled={!chainCode}>
          Crear wallet
        </Button>
      </Box>
      <Box px={10} py={10}>
        <Button
          onClick={() => navigate(ROUTES_MAP.ONBOARDING_RECOVER)}
          disabled={!chainCode}>
          Recuperar wallet
        </Button>
      </Box>
    </PageLayout>
  );
};

export default SelectOptions;
