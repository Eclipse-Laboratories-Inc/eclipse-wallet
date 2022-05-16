import React from 'react';
import AppProvider from './AppProvider';
import WelcomePage from './pages/Welcome/WelcomePage';

const App = () => (
  <AppProvider>
    <div>
      <WelcomePage />
    </div>
  </AppProvider>
);

export default App;
