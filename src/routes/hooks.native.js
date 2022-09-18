import React, { useContext, useEffect, useState } from 'react';
import {
  NavigationContext,
  useNavigationState,
} from '@react-navigation/native';
import { globalRoutes } from './app-routes';
import { getRoute } from './utils';
import get from 'lodash/get';

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
      } else if (toRoute.defaultScreen) {
        // Parent route default screen
        const screenRoute = getRoute(globalRoutes, toRoute.defaultScreen);
        navigation.navigate(toRoute.name, {
          params,
          screen: screenRoute.name,
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

export const useCurrentTab = ({ tabs }) => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const focusedRoute = useNavigationState(state => {
    const route = get(state, `routes[${state.index}]`);
    if (route && route.name === 'wallet' && route.state) {
      return get(route, `state.routes[${route.state.index}].name`);
    } else {
      return tabs[0].title;
    }
  });
  useEffect(() => {
    const selectedTab = tabs.find(t => t.title === focusedRoute);
    if (selectedTab) {
      setCurrentTab(selectedTab);
    }
  }, [focusedRoute, tabs]);
  return currentTab;
};
