import React from 'react';
import Card from '../../component-library/Card/Card';
import PageLayout from '../../component-library/Layout/PageLayout';

const WelcomePage = () => (
  <PageLayout>
    <Card
      title="Welcome"
      subtitle="Salmon Wallet"
      content="Here you can manage your cryptocoins"
    />
  </PageLayout>
);

export default WelcomePage;
