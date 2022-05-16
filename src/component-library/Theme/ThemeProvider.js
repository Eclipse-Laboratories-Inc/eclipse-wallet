import React from 'react';
import {
  ThemeProvider as MUIThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@mui/material/styles';

const theme = createMuiTheme({
  palette: {
    text: {
      primary: '#A0F',
    },
  },
});

const ThemeProvider = ({children}) => (
  <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
);

export default ThemeProvider;
