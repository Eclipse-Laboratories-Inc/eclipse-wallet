import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';

import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

import ENDPOINTS from '../../config/endpoints';
import { getDefaultChain } from '../../utils/wallet';

const ChangeNetworkPage = () => {
  const [{ selectedEndpoints }, { changeEndpoint }] = useContext(AppContext);
  const onSelect = value => {
    changeEndpoint(getDefaultChain(), value);
  };
  return (
    <GlobalLayoutForTabScreen>
      <GlobalPadding />

      <GlobalText type="headline2" center>
        Select Token
      </GlobalText>

      <GlobalPadding />

      {Object.keys(ENDPOINTS[getDefaultChain()]).map(label => (
        <GlobalButtonCard
          key={label}
          active={
            selectedEndpoints[getDefaultChain()] ===
            ENDPOINTS[getDefaultChain()][label]
          }
          onPress={() => onSelect(ENDPOINTS[getDefaultChain()][label])}
          title={label}
          description={ENDPOINTS[getDefaultChain()][label]}
        />
      ))}
    </GlobalLayoutForTabScreen>
  );
};

export default ChangeNetworkPage;
