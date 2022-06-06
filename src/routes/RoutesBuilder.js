import React from 'react';
import {Route, Routes} from 'react-router-dom';

const RoutesBuilder = ({routes, ...props}) => (
  <Routes>
    {routes.map(({key, name, path, Component}) => (
      <Route key={`route-${key}`} path={path} element={<Component />} />
    ))}
  </Routes>
);

export default RoutesBuilder;
