import React from 'react';
import {Route, Routes} from 'react-router-dom';

import AppProvider from './AppProvider';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import WelcomePage from './pages/Welcome/WelcomePage';

const App = () => (
  <AppProvider>
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="onboarding/*" element={<OnboardingPage />} />
    </Routes>
  </AppProvider>
);

export default App;
