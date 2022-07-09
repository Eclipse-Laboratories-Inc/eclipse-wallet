import React from 'react';

import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalText from '../../component-library/Global/GlobalText';

import AvatarImage from '../../component-library/Image/AvatarImage';

const TokenList = ({ tokens, onDetail }) => (
  <>
    {tokens.map(t => (
      <GlobalButtonCard
        key={t.address}
        onPress={() => onDetail(t)}
        icon={<AvatarImage url={t.logo} size={48} />}
        title={t.name}
        description={`${t.decimals} ${t.symbol}`}
        actions={<GlobalText type="body2">$0.00</GlobalText>}
      />
    ))}
  </>
);

export default TokenList;
