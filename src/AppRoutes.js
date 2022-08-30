import React, { useContext } from 'react';
import { AppContext } from './AppProvider';
import routes, { ROUTES_MAP } from './routes/app-routes';
import RoutesBuilder from './routes/RoutesBuilder';

const AppRoutes = () => {
  const [{ isAdapter, wallets }] = useContext(AppContext);

  let entry;
  if (isAdapter) {
    entry = ROUTES_MAP.ADAPTER;
  } else if (wallets.length) {
    entry = ROUTES_MAP.WALLET;
  } else {
    entry = ROUTES_MAP.WELCOME;
  }

  return (
    <RoutesBuilder routes={routes} entry={entry} requireOnboarding={false} />
  );
};

export default AppRoutes;
