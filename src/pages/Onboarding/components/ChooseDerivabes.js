import React, { useState } from 'react';

import { GlobalLayoutForTabScreen } from '../../../component-library/Global/GlobalLayout';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import CardButton from '../../../component-library/CardButton/CardButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';

import AvatarImage from '../../../component-library/Image/AvatarImage';
import { getDefaultChain, LOGOS } from '../../../utils/wallet';

const ChooseDerivabes = ({ accounts, onComplete }) => {
  const [selected, setSelected] = useState([]);
  const updateSelected = (index, status) => {
    if (status) {
      setSelected([...selected, index]);
    } else {
      setSelected([...selected.filter(s => s !== index)]);
    }
  };
  return (
    <GlobalLayoutForTabScreen>
      <GlobalPadding />

      <GlobalText type="headline2" center>
        Derivable Accounts
      </GlobalText>

      <GlobalText type="body1" center>
        m/44´/501/...
      </GlobalText>

      <GlobalPadding size="xl" />

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

      <GlobalPadding />

      <GlobalButton
        type="primary"
        wide
        title="Recover"
        onPress={() => onComplete(selected)}
      />
    </GlobalLayoutForTabScreen>
  );
};

export default ChooseDerivabes;
