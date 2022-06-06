import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import find from 'lodash/find';
import get from 'lodash/get';

const getDefaultRoute = routes =>
  get(
    find(routes, route => route.default),
    'name',
  );

const RoutesBuilder = ({routes, ...props}) => {
  const Stack = useMemo(() => createNativeStackNavigator(), []);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={getDefaultRoute(routes)}>
      {routes.map(({key, name, Component}) => (
        <Stack.Screen key={`route-${key}`} name={name} component={Component} />
      ))}
    </Stack.Navigator>
  );
};

export default RoutesBuilder;
