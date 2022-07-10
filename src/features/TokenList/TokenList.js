import React from 'react';

import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalText from '../../component-library/Global/GlobalText';
import AvatarImage from '../../component-library/Image/AvatarImage';
import { showAmount, showPercentage } from '../../utils/amount';

const TokenList = ({ tokens, onDetail }) => (
  <>
    {tokens.map(t => (
      <GlobalButtonCard
        key={t.mint}
        onPress={() => onDetail(t)}
        icon={<AvatarImage url={t.logo} size={48} />}
        title={t.name}
        description={`${t.uiAmount} ${t.symbol || ''}`}
        actions={[
          <GlobalText key={'amount-action'} type="body2">
            {showAmount(t.usdBalance)}
          </GlobalText>,
          t.last24HoursChange && (
            <GlobalText key={'perc-action'} type="body2">
              {showPercentage(t.last24HoursChange.perc)}
            </GlobalText>
          ),
        ].filter(Boolean)}
      />
    ))}
  </>
);

export default TokenList;
