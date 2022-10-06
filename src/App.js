import React from 'react';

import AppProvider from './AppProvider';
import AppRoutes from './AppRoutes';
import ReactGA from 'react-ga4';

const App = () => {
  ReactGA.initialize('G-HE1ZJJBN0V');
  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
