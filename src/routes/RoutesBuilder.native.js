import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import find from 'lodash/find';

const getDefaultRoute = routes => find(routes, route => route.default).name;

const RoutesBuilder = ({routes, type}) => {
  const Stack = useMemo(() => createNativeStackNavigator(), []);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={getDefaultRoute(routes)}>
      {routes.map(({name, Component}) => (
        <Stack.Screen key={`route-${name}`} name={name} component={Component} />
      ))}
    </Stack.Navigator>
  );
};

export default RoutesBuilder;
