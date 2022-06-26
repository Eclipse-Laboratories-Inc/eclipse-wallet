import find from 'lodash/find';
import get from 'lodash/get';

export const getRoute = (routes, routeKey) =>
  find(routes, route => route.key === routeKey);

export const getDefaultRoute = routes =>
  get(
    find(routes, route => route.default),
    'name',
  );

export const getRouteComponent = (routes, key) =>
  get(
    find(routes, route => route.key === key),
    'Component',
  );

export const getRouteName = (routes, key) =>
  get(
    find(routes, route => route.key === key),
    'name',
  );
