import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import { getDefaultChain } from '../../utils/wallet';

const ChangeNetworkPage = () => {
  const [{ activeWallet }, { changeEndpoint }] = useContext(AppContext);
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

      {activeWallet.getNetworks().map(({ cluster: label, endpoint }) => (
        <GlobalButtonCard
          key={label}
          active={label === activeWallet.getCurrentNetwork().cluster}
          onPress={() => onSelect(label)}
          title={label}
          description={endpoint}
        />
      ))}
    </GlobalLayoutForTabScreen>
  );
};

export default ChangeNetworkPage;
