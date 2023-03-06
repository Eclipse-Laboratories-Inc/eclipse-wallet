import { find, get } from 'lodash';

export const getRoute = (routes, routeKey) =>
  find(routes, route => route.key === routeKey);

export const getDefaultRoute = routes =>
  get(
    find(routes, route => route.default),
    'name',
  );

export const getDefaultRouteKey = routes =>
  get(
    find(routes, route => route.default),
    'key',
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

export const getRoutesWithParent = (routes, parent) =>
  routes.map(r => ({ ...r, parent }));
