import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { getDefaultRoute, getRouteName } from './utils';
import { ROUTES_TYPES } from './constants';

import theme from '../component-library/Global/theme';
import { useNavigation } from './hooks';
import { AppContext } from '../AppProvider';
import { ROUTES_MAP } from './app-routes';

const createFunction = {
  [ROUTES_TYPES.STACK]: createNativeStackNavigator,
  [ROUTES_TYPES.TABS]: createBottomTabNavigator,
};

const styles = StyleSheet.create({
  sceneStyles: {
    backgroundColor: 'transparent',
  },
});

const RoutesBuilder = ({
  routes,
  entry,
  type = ROUTES_TYPES.STACK,
  requireOnboarding = true,
  ..._
}) => {
  const navigate = useNavigation();
  const [{ wallets }] = useContext(AppContext);
  useEffect(() => {
    if (requireOnboarding && !wallets.length) {
      navigate(ROUTES_MAP.ONBOARDING);
    }
  }, [requireOnboarding, navigate, wallets]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Nav = useMemo(() => createFunction[type](), []);

  return !requireOnboarding || (requireOnboarding && wallets.length > 0) ? (
    <Nav.Navigator
      sceneContainerStyle={styles.sceneStyles}
      screenOptions={{
        detachPreviousScreen: true,
        headerShown: false,
        contentStyle: styles.sceneStyles,
        overlayColor: theme.colors.cards,
        animation: 'slide_from_right',
      }}
      tabBar={() => {}}
      initialRouteName={
        entry ? getRouteName(routes, entry) : getDefaultRoute(routes)
      }>
      {routes
        .filter(({ parent }) => !parent)
        .map(({ key, name, Component }) => (
          <Nav.Screen key={`route-${key}`} name={name} component={Component} />
        ))}
    </Nav.Navigator>
  ) : null;
};

export default RoutesBuilder;
