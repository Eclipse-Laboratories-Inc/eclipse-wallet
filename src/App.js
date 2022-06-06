import React from 'react';
import AppProvider from './AppProvider';
import routes from './routes/app-routes';
import RoutesBuilder from './routes/RoutesBuilder';

const App = () => (
  <AppProvider>
    <RoutesBuilder routes={routes} />
  </AppProvider>
);

export default App;
