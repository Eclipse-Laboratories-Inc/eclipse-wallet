import React from 'react';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes from './routes';

const OnboardingPage = () => (
  <RoutesBuilder routes={routes} requireOnboarding={false} />
);

export default OnboardingPage;
