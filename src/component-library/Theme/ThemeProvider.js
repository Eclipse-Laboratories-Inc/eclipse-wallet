import React from 'react';
import {
  ThemeProvider as MUIThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#121212',
    },
    mode: 'dark',
    main: 'blue',
  },
});

const ThemeProvider = ({children}) => (
  <MUIThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
);

export default ThemeProvider;
