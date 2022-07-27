import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { getDefaultRoute, getRouteName } from './utils';
import { ROUTES_TYPES } from './constants';

import theme from '../component-library/Global/theme';

const createFunction = {
  [ROUTES_TYPES.STACK]: createNativeStackNavigator,
  [ROUTES_TYPES.TABS]: createBottomTabNavigator,
};

const styles = StyleSheet.create({
  sceneStyles: {
    backgroundColor: 'transparent',
  },
});

const RoutesBuilder = ({ routes, entry, type = ROUTES_TYPES.STACK, ..._ }) => {
  const [detachPreviousScreen, setDetachPreviousScreen] = React.useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Nav = useMemo(() => createFunction[type](), []);
  return (
    <Nav.Navigator
      sceneContainerStyle={styles.sceneStyles}
      screenOptions={{
        detachPreviousScreen: true,
        headerShown: false,
        contentStyle: styles.sceneStyles,
        overlayColor: theme.colors.cards,
        animation: 'none',
      }}
      tabBar={() => {}}
      initialRouteName={
        entry ? getRouteName(routes, entry) : getDefaultRoute(routes)
      }>
      {routes.map(({ key, name, Component }) => (
        <Nav.Screen key={`route-${key}`} name={name} component={Component} />
      ))}
    </Nav.Navigator>
  );
};

export default RoutesBuilder;
