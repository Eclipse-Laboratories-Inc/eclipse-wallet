import {useContext} from 'react';
import {NavigationContext} from '@react-navigation/native';
import find from 'lodash/find';
import {globalRoutes} from './app-routes';

const getRoute = routeKey =>
  find(globalRoutes, route => route.key === routeKey);

export const useNavigation = () => {
  const navigation = useContext(NavigationContext);
  return to => {
    const toRoute = getRoute(to);
    if (toRoute) {
      navigation.navigate(toRoute.name);
    } else {
      console.warn(`route not found ${to}`);
    }
  };
};
