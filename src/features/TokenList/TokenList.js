import React from 'react';
import get from 'lodash/get';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import AvatarImage from '../../component-library/Image/AvatarImage';
import {
  hiddenValue,
  showAmount,
  showPercentage,
  getLabelValue,
} from '../../utils/amount';

const TokenList = ({ tokens, onDetail, hiddenBalance }) => (
  <>
    {tokens ? (
      <List tokens={tokens} onDetail={onDetail} hiddenBalance={hiddenBalance} />
    ) : (
      <GlobalSkeleton type="TokenList" />
    )}
  </>
);

const List = ({ tokens, onDetail, hiddenBalance }) => (
  <>
    {tokens.map(t => (
      <CardButton
        key={t.mint}
        onPress={() => onDetail(t)}
        icon={<AvatarImage url={t.logo} size={48} />}
        title={t.name}
        description={`${hiddenBalance ? hiddenValue : t.uiAmount} ${
          t.symbol || ''
        }`}
        actions={[
          <GlobalText key={'amount-action'} type="body2">
            {hiddenBalance ? hiddenValue : showAmount(t.usdBalance)}
          </GlobalText>,
          t.last24HoursChange && (
            <GlobalText
              key={'perc-action'}
              type="body2"
              color={getLabelValue(get(t, 'last24HoursChange.perc'))}>
              {showPercentage(get(t, 'last24HoursChange.perc'))}
            </GlobalText>
          ),
        ].filter(Boolean)}
      />
    ))}
  </>
);

export default TokenList;
