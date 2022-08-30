import React from 'react';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes, { ROUTES_MAP } from './routes';

const Adapter = () => (
  <RoutesBuilder
    routes={routes}
    entry={ROUTES_MAP.ADAPTER_SELECT}
    requireOnboarding={false}
  />
);

export default Adapter;
