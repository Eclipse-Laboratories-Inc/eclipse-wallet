import React from 'react';
import RoutesBuilder from '../../routes/RoutesBuilder';
import CreateWallet from './CreateWallet';
import RecoverWallet from './RecoverWallet';
import SelectOptions from './SelectOptions';

const OnboardingPage = () => (
  <RoutesBuilder
    routes={[
      {name: 'home', path: '', Component: SelectOptions, default: true},
      {name: 'create', path: 'create', Component: CreateWallet},
      {name: 'recover', path: 'recover', Component: RecoverWallet},
    ]}
  />
);

export default OnboardingPage;
