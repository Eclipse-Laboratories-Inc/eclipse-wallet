import React from 'react';
import { get, isNil } from 'lodash';
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

const TokenList = ({ loading, tokens, onDetail, hiddenBalance }) => {
  if (loading) {
    return <GlobalSkeleton type="TokenList" />;
  }
  return (
    <List tokens={tokens} onDetail={onDetail} hiddenBalance={hiddenBalance} />
  );
};

const List = ({ tokens, onDetail, hiddenBalance }) => (
  <>
    {tokens.map(t => (
      <CardButton
        key={t.address}
        onPress={() => onDetail(t)}
        icon={<AvatarImage url={t.logo} size={48} />}
        title={t.name}
        description={`${hiddenBalance ? hiddenValue : t.uiAmount} ${
          t.symbol || ''
        }`}
        actions={[
          !isNil(t.usdBalance) && (
            <GlobalText key={'amount-action'} type="body2">
              {hiddenBalance ? hiddenValue : showAmount(t.usdBalance)}
            </GlobalText>
          ),
          t.last24HoursChange && (
            <GlobalText
              key="perc-action"
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
