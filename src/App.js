import React from 'react';
import {Route, Routes} from 'react-router-dom';

import AppProvider from './AppProvider';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import WalletPage from './pages/Wallet/WalletPage';
import WelcomePage from './pages/Welcome/WelcomePage';

const App = () => (
  <AppProvider>
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="onboarding/*" element={<OnboardingPage />} />
      <Route path="wallet/*" element={<WalletPage />} />
    </Routes>
  </AppProvider>
);

export default App;
