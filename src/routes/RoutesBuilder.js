import React from 'react';
import {Route, Routes} from 'react-router-dom';

const RoutesBuilder = ({routes, type}) => (
  <Routes>
    {routes.map(({name, path, Component}) => (
      <Route key={`route-${name}`} path={path} element={<Component />} />
    ))}
  </Routes>
);

export default RoutesBuilder;
