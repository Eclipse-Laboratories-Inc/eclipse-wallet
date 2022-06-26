import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getDefaultRoute, getRouteName} from './utils';
import {BottomTabs} from '../component-library/Layout/BottomTabsLayout';
import {ROUTES_TYPES} from './constants';

const createFunction = {
  [ROUTES_TYPES.STACK]: createNativeStackNavigator,
  [ROUTES_TYPES.TABS]: createBottomTabNavigator,
};

const RoutesBuilder = ({routes, entry, type = ROUTES_TYPES.STACK, ..._}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Nav = useMemo(() => createFunction[type](), []);
  return (
    <Nav.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={
        entry ? getRouteName(routes, entry) : getDefaultRoute(routes)
      }
      {...(type === ROUTES_TYPES.TABS
        ? {
            tabBar: ({state, navigation}) => (
              <BottomTabs
                tabs={routes.map(r => ({
                  title: r.name,
                  onClick: () => navigation.jumpTo(r.name),
                }))}
              />
            ),
          }
        : {})}>
      {routes.map(({key, name, Component}) => (
        <Nav.Screen key={`route-${key}`} name={name} component={Component} />
      ))}
    </Nav.Navigator>
  );
};

export default RoutesBuilder;
