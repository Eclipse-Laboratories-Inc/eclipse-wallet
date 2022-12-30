import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes from './routes';
import { ROUTES_TYPES } from '../../routes/constants';
import { retriveConfig } from '../../utils/config';
import UnavailablePage from './UnavailablePage';

import GlobalTabBarLayout from '../../component-library/Global/GlobalTabBarLayout';

const WalletPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet }] = useContext(AppContext);
  const [configs, setConfigs] = useState(null);

  useEffect(() => {
    retriveConfig().then(chainConfigs => {
      setConfigs(chainConfigs[activeWallet.chain].sections);
      if (!configs?.nfts) {
        routes.find(r => r.name === 'NFT').Component = UnavailablePage;
      }
      if (!configs?.swap) {
        routes.find(r => r.name === 'Swap').Component = UnavailablePage;
      }
    });
  });

  return (
    <GlobalTabBarLayout
      tabs={routes
        .filter(r => !!r.icon)
        .map(r => ({
          title: r.name,
          onClick: () => navigate(r.key),
          icon: r.icon,
          route: r.route,
        }))}>
      <RoutesBuilder routes={routes} type={ROUTES_TYPES.TABS} />
    </GlobalTabBarLayout>
  );
};

export default WalletPage;
