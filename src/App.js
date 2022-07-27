import React from 'react';

import AppProvider from './AppProvider';
import AppRoutes from './AppRoutes';

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
);

export default App;
