import React, { useState } from 'react';

import { getDefaultChain, LOGOS } from '../../../utils/wallet';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import CardButton from '../../../component-library/CardButton/CardButton';

import AvatarImage from '../../../component-library/Image/AvatarImage';

const ChooseDerivabes = ({ accounts, onComplete, t }) => {
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
      <GlobalLayout.Header>
        <GlobalBackTitle
          title="Derivable Accounts"
          secondaryTitle="m/44´/501/..."
        />

        {accounts.map(({ index }) => (
          <CardButton
            key={`wallet-${index}`}
            active={selected.includes(index)}
            title="Public Key"
            description="0.0000.00"
            actions={<GlobalText type="body2">$0.000.000</GlobalText>}
            onPress={() => updateSelected(index, !selected.includes(index))}
            icon={<AvatarImage url={LOGOS[getDefaultChain()]} size={48} />}
          />
        ))}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title="Recover"
          onPress={() => onComplete(selected)}
        />
      </GlobalLayout.Footer>
    </>
  );
};

export default ChooseDerivabes;
