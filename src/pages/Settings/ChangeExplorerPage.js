import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { getWalletChain } from '../../utils/wallet';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import useUserConfig from '../../hooks/useUserConfig';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const ChangeExplorerPage = ({ t }) => {
  const navigate = useNavigation();

  const [{ activeWallet }] = useContext(AppContext);
  const chain = getWalletChain(activeWallet);
  const { explorer, explorers, changeExplorer } = useUserConfig(
    chain,
    activeWallet.networkId,
  );

  const onSelect = value => {
    changeExplorer(value);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.select_explorer`)}
        />

        {explorers &&
          explorer &&
          explorers.map(({ name, key }) => (
            <CardButton
              key={name}
              active={name === explorer.name}
              complete={name === explorer.name}
              title={name}
              onPress={() => onSelect(key)}
            />
          ))}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(ChangeExplorerPage);
