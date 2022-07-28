import React, { useContext } from 'react';
import { AppContext } from './AppProvider';
import routes, { ROUTES_MAP } from './routes/app-routes';
import RoutesBuilder from './routes/RoutesBuilder';

const AppRoutes = () => {
  const [{ wallets }] = useContext(AppContext);
  return (
    <RoutesBuilder
      routes={routes}
      entry={wallets.length ? ROUTES_MAP.WALLET : ROUTES_MAP.WELCOME}
      requireOnboarding={false}
    />
  );
};

export default AppRoutes;
