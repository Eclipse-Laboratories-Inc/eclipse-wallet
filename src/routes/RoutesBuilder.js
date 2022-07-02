import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { getRouteComponent } from './utils';

const RoutesBuilder = ({ routes, entry, ...props }) => {
  const EntryComponent = entry ? getRouteComponent(routes, entry) : null;
  return (
    <Routes>
      {EntryComponent && <Route path="/" element={<EntryComponent />} />}
      {routes.map(({ key, name, path, Component }) => (
        <Route key={`route-${key}`} path={path} element={<Component />} />
      ))}
    </Routes>
  );
};

export default RoutesBuilder;
