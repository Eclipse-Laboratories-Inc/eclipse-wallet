import React, { useContext, useMemo } from 'react';
import { AppContext } from './AppProvider';
import routes, { ROUTES_MAP } from './routes/app-routes';
import RoutesBuilder from './routes/RoutesBuilder';

const AppRoutes = () => {
  const [{ isAdapter, accounts }] = useContext(AppContext);

  const entry = useMemo(() => {
    if (isAdapter) {
      return ROUTES_MAP.ADAPTER;
    } else if (accounts.length) {
      return ROUTES_MAP.WALLET;
    } else {
      return ROUTES_MAP.WELCOME;
    }
  }, [isAdapter, accounts.length]);

  return (
    <RoutesBuilder routes={routes} entry={entry} requireOnboarding={false} />
  );
};

export default AppRoutes;
