import React, { useState } from 'react';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import SelectableCard from '../../component-library/Card/SelectableCard';
import AvatarImage from '../../component-library/Image/AvatarImage';
import Image from '../../component-library/Image/Image';
import GlobalLayout from '../../component-library/Layout/GlobalLayout';
import TextTitle from '../../component-library/Text/TextTitle';
import Logo from '../../images/logo.png';
import { useNavigation } from '../../routes/hooks';
import { getChains, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP } from './routes';

const SelectAction = ({ onNext }) => (
  <>
    <Box px={10} py={10}>
      <TextTitle>Welcome to</TextTitle>
    </Box>
    <Box px={10} py={10}>
      <Image src={Logo} alt="logo" />
    </Box>
    <Box px={10} py={10}>
      <Button onClick={() => onNext(ROUTES_MAP.ONBOARDING_CREATE)}>
        Crear wallet
      </Button>
    </Box>
    <Box px={10} py={10}>
      <Button onClick={() => onNext(ROUTES_MAP.ONBOARDING_RECOVER)}>
        Recuperar wallet
      </Button>
    </Box>
  </>
);

const SelectChain = ({ onNext, blockChains }) => {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <Box px={10} py={10}>
        <TextTitle>Select Blockchain</TextTitle>
      </Box>
      <Box px={10} py={10}>
        {blockChains.map((chain, index) => (
          <SelectableCard
            selected={index === selected}
            onSelect={() => setSelected(index)}
            headerIcon={<AvatarImage url={LOGOS[chain]} size={48} />}
            headerTitle={chain}
          />
        ))}
      </Box>
      <Box px={10} py={10}>
        <Button onClick={() => onNext(blockChains[selected])}>Continue</Button>
      </Box>
    </>
  );
};

const SelectOptions = () => {
  const navigate = useNavigation();
  const [actionRoute, setActionRoute] = useState();
  const [step, setStep] = useState(0);
  const onSelectAction = action => {
    setActionRoute(action);
    setStep(1);
  };
  const onSelectChain = chain => {
    navigate(actionRoute);
  };
  return (
    <GlobalLayout>
      {step === 0 && <SelectAction onNext={onSelectAction} />}
      {step === 1 && (
        <SelectChain onNext={onSelectChain} blockChains={getChains()} />
      )}
    </GlobalLayout>
  );
};

export default SelectOptions;
