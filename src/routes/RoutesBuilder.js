import React, { useContext, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppContext } from '../AppProvider';
import { getRouteComponent } from './utils';
import { ROUTES_MAP } from './app-routes';
import { useNavigation } from './hooks';

const RoutesBuilder = ({
  routes,
  configs,
  entry,
  requireOnboarding = true, // Default value for requireOnboarding
}) => {
  const navigate = useNavigation();
  const [{ accounts }] = useContext(AppContext);

  // Check if onboarding is required and accounts are available
  const needsOnboarding = requireOnboarding && accounts.length === 0;

  // Navigate to onboarding if required
  useEffect(() => {
    if (needsOnboarding) {
      navigate(ROUTES_MAP.ONBOARDING);
    }
  }, [needsOnboarding, navigate]);

  // Memoized computation of the entry component
  const EntryComponent = useMemo(
    () => (entry ? getRouteComponent(routes, entry) : null),
    [entry, routes]
  );

  // Render routes conditionally based on onboarding status
  if (needsOnboarding) return null;

  return (
    <Routes>
      {EntryComponent && <Route path="/" element={<EntryComponent />} />}
      {routes.map(({ key, name, path, Component }) => (
        <Route
          key={`route-${key}`}
          path={path}
          element={<Component cfgs={configs} />}
        />
      ))}
    </Routes>
  );
};

export default RoutesBuilder;
