import React from 'react';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes from './routes';

const OnboardingSection = () => (
  <RoutesBuilder routes={routes} requireOnboarding={false} />
);

export default OnboardingSection;
