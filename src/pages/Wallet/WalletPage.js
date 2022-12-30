import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes from './routes';
import { ROUTES_TYPES } from '../../routes/constants';
import { retriveConfig } from '../../utils/wallet';
import SwapPage from './SwapPage';
import NftsSection from '../Nfts';
import UnavailablePage from './UnavailablePage';

import GlobalTabBarLayout from '../../component-library/Global/GlobalTabBarLayout';

const WalletPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet }] = useContext(AppContext);
  const [configs, setConfigs] = useState(null);

  useEffect(() => {
    retriveConfig().then(chainConfigs => {
      setConfigs(chainConfigs[activeWallet.chain].sections);
      const nftsRoute = routes.find(r => r.name === 'NFT');
      const swapRoute = routes.find(r => r.name === 'Swap');
      if (configs) {
        if (!configs?.nfts?.active) {
          nftsRoute.Component = UnavailablePage;
        } else {
          nftsRoute.Component = NftsSection;
        }
        if (!configs?.swap?.active) {
          swapRoute.Component = UnavailablePage;
        } else {
          swapRoute.Component = SwapPage;
        }
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
