import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppContext } from '../AppProvider';
import { getRouteComponent } from './utils';
import { ROUTES_MAP } from './app-routes';
import { useNavigation } from './hooks';

const RoutesBuilder = ({ routes, entry, requireOnboarding = true, ..._ }) => {
  const navigate = useNavigation();
  const [{ accounts }] = useContext(AppContext);
  useEffect(() => {
    if (requireOnboarding && !accounts.length) {
      navigate(ROUTES_MAP.ONBOARDING);
    }
  }, [requireOnboarding, navigate, accounts]);

  const EntryComponent = entry ? getRouteComponent(routes, entry) : null;

  return !requireOnboarding || (requireOnboarding && accounts.length > 0) ? (
    <Routes>
      {EntryComponent && <Route path="/" element={<EntryComponent />} />}
      {routes.map(({ key, name, path, Component }) => (
        <Route key={`route-${key}`} path={path} element={<Component />} />
      ))}
    </Routes>
  ) : null;
};

export default RoutesBuilder;
