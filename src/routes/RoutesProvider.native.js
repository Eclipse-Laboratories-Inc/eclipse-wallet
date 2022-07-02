import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

const RoutesProvider = ({ children }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

export default RoutesProvider;
