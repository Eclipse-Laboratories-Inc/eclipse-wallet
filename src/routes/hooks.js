import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { globalRoutes } from './app-routes';
import { getRoute } from './utils';

const buildRouteWithParams = (route, params) =>
  Object.keys(params).reduce(
    (path, param) => path.replace(`:${param}`, params[param]),
    route,
  );

export const useNavigation = () => {
  const navigate = useNavigate();
  return (to, params = {}) => {
    const toRoute = getRoute(globalRoutes, to);
    if (toRoute) {
      navigate(buildRouteWithParams(toRoute.route, params));
    } else {
      console.warn(`route not found ${to}`);
    }
  };
};

export const withParams = Component => props => {
  const params = useParams();
  return <Component {...props} params={params} />;
};
