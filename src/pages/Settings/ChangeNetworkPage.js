import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import { getWalletChain } from '../../utils/wallet';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';

const ChangeNetworkPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, selectedEndpoints }, { changeEndpoint }] =
    useContext(AppContext);
  const onSelect = value => {
    changeEndpoint(getWalletChain(activeWallet), value);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={onBack}>
        <GlobalText type="headline2" center>
          Select Network
        </GlobalText>
      </GlobalBackTitle>

      <GlobalPadding />

      {activeWallet.getNetworks().map(({ cluster: label, endpoint }) => (
        <GlobalButtonCard
          key={label}
          active={label === selectedEndpoints[getWalletChain(activeWallet)]}
          onPress={() => onSelect(label)}
          title={label}
          description={endpoint}
        />
      ))}
    </GlobalLayoutForTabScreen>
  );
};

export default ChangeNetworkPage;
