import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#A0F',
  },
};

const ThemProvider = ({children}) => (
  <PaperProvider theme={theme}>{children}</PaperProvider>
);

export default ThemProvider;
