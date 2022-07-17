import React, { useContext } from 'react';
import { NavigationContext } from '@react-navigation/native';
import { globalRoutes } from './app-routes';
import { getRoute } from './utils';

export const useNavigation = () => {
  const navigation = useContext(NavigationContext);
  return (to, params = {}) => {
    const toRoute = getRoute(globalRoutes, to);
    if (toRoute) {
      if (toRoute.parent) {
        const parentRoute = getRoute(globalRoutes, toRoute.parent);
        navigation.navigate(parentRoute.name, {
          params,
          screen: toRoute.name,
        });
      } else {
        navigation.navigate(toRoute.name, params);
      }
    } else {
      console.warn(`route not found ${to}`);
    }
  };
};

export const withParams =
  Component =>
  ({ route = {}, ...props }) => {
    const params = route.params;
    return <Component {...props} params={params} />;
  };
