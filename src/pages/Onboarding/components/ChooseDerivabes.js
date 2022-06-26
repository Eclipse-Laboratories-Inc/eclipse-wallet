import React, {useState} from 'react';
import Box from '../../../component-library/Box/Box';
import Button from '../../../component-library/Button/Button';
import {SelectableWalletCard} from '../../../features/WalletCard/WalletCard';

const ChooseDerivabes = ({accounts, onComplete}) => {
  const [selected, setSelected] = useState([]);
  const updateSelected = (index, status) => {
    if (status) {
      setSelected([...selected, index]);
    } else {
      setSelected([...selected.filter(s => s !== index)]);
    }
  };
  return (
    <>
      <Box px={10} py={10}>
        {accounts.map(({index}) => (
          <SelectableWalletCard
            key={`wallet-${index}`}
            onSelect={status => updateSelected(index, status)}
            selected={selected.includes(index)}
          />
        ))}
      </Box>
      <Box px={10} py={10}>
        <Button onClick={() => onComplete(selected)}>Continue</Button>
      </Box>
    </>
  );
};

export default ChooseDerivabes;
