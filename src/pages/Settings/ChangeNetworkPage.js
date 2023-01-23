import React, { useContext, useEffect, useState } from 'react';
import { getNetworks, getSwitches } from '4m-wallet-adapter';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const ChangeNetworkPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ networkId }, { changeNetwork }] = useContext(AppContext);
  const onSelect = targetId => changeNetwork(targetId);

  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);
  const [switches, setSwitches] = useState([]);
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    const load = async () => {
      setSwitches(await getSwitches());
      setNetworks(await getNetworks());
    };

    load();
  }, []);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`settings.change_network`)} />

        {networks.map(({ id, name, icon }) => (
          <CardButton
            key={id}
            active={id === networkId}
            complete={id === networkId}
            title={name}
            image={icon}
            disabled={!switches[id]?.enable}
            onPress={() => onSelect(id)}
          />
        ))}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(ChangeNetworkPage);
