import React from 'react';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DarkTheme,
  dark: true,
  mode: 'adaptative',
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
  },
};

const ThemeProvider = ({ children }) => (
  <PaperProvider theme={theme}>{children}</PaperProvider>
);

export default ThemeProvider;
