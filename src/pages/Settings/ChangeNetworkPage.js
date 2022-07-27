import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../../AppProvider';
import { getWalletChain } from '../../utils/wallet';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const ChangeNetworkPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, selectedEndpoints }, { changeEndpoint }] =
    useContext(AppContext);
  const onSelect = value => {
    changeEndpoint(getWalletChain(activeWallet), value);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);
  const [networks, setNetworks] = useState([]);
  useEffect(() => {
    activeWallet.getNetworks().then(nwks => {
      if (nwks?.length > 0) {
        setNetworks(nwks);
      }
    });
  }, [activeWallet]);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title="Select Network" />

        <GlobalPadding />

        {networks.map(({ id: label, description }) => (
          <CardButton
            key={label}
            active={label === selectedEndpoints[getWalletChain(activeWallet)]}
            complete={label === selectedEndpoints[getWalletChain(activeWallet)]}
            title={label}
            description={description}
            onPress={() => onSelect(label)}
          />
        ))}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default ChangeNetworkPage;
