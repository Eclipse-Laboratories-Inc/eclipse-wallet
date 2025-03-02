import React, { useState, useContext, useEffect, useMemo } from 'react';
import { getSwitches } from 'eclipse-wallet-adapter';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes from './routes';
import { ROUTES_TYPES } from '../../routes/constants';
import SwapPage from './SwapPage';
import NftsSection from '../Nfts';
import UnavailablePage from './UnavailablePage';

import GlobalTabBarLayout from '../../component-library/Global/GlobalTabBarLayout';

const WalletPage = () => {
  const navigate = useNavigation();
  const [{ networkId }] = useContext(AppContext);
  const [switches, setSwitches] = useState(null);
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchSwitches = async () => {
      try {
        const allSwitches = await getSwitches();
        if (allSwitches && allSwitches[networkId] && allSwitches[networkId].sections) {
          setSwitches(allSwitches[networkId].sections);
        } else {
          setError('Configuration data is missing.');
        }
      } catch (err) {
        console.error('Failed to fetch switches', err);
        setError('Unable to load configuration switches.');
      }
    };

    fetchSwitches();
  }, [networkId]);

 useEffect(() => {
    if (switches) {
      const nftsRoute = routes.find(r => r.name === 'NFT');
      const swapRoute = routes.find(r => r.name === 'Swap');

      if (nftsRoute) {
        nftsRoute.Component = switches.nfts?.active ? NftsSection : UnavailablePage;
      }
      if (swapRoute) {
        swapRoute.Component = switches.swap?.active ? SwapPage : UnavailablePage;
      }
    }
  }, [switches]);

   const tabs = useMemo(
    () =>
      routes
        .filter(r => !!r.icon)
        .map(r => ({
          title: r.name,
          onClick: () => navigate(r.key),
          icon: r.icon,
          route: r.route,
        })),
    [navigate]
  );

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!switches) {
    return <div>Loading...</div>;
  }

  return (
   <GlobalTabBarLayout tabs={tabs}>
      <RoutesBuilder routes={routes} type={ROUTES_TYPES.TABS} />
    </GlobalTabBarLayout>
  );
};

export default WalletPage;
