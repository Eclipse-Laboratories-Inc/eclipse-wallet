import React from 'react';
import {
  ThemeProvider as MUIThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#171B27',
      paper: 'rgba(0,0,0,0)',
    },
    mode: 'dark',
    main: 'blue',
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ffffff',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#2A384E',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    tertiary: {
      light: '#808799',
      main: '#808799',
      contrastText: '#808799',
    },
  },
  typography: {
    fontFamily: 'DM Sans',
    h1: {
      fontFamily: 'DM Sans',
    },
    button: {
      fontSize: '1rem',
      fontFamily: 'DM Sans',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const ThemeProvider = ({ children }) => (
  <MUIThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
);

export default ThemeProvider;
