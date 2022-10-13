import React from 'react';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalSkeleton from '../../../component-library/Global/GlobalSkeleton';

import { DAppCard } from './DAppCard';
import { ActiveWalletCard } from './ActiveWalletCard';
import { withTranslation } from '../../../hooks/useTranslations';

const SimulatingTransactions = ({ t, origin, name, icon }) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <ActiveWalletCard />
      <GlobalBackTitle title={t('adapter.detail.transaction.title')} nospace />
      <GlobalPadding size="xl" />
      <DAppCard name={name} icon={icon} origin={origin} />
    </GlobalLayout.Header>
    <GlobalLayout.Inner>
      <GlobalSkeleton type="TransactionSimulation" />
    </GlobalLayout.Inner>
  </GlobalLayout>
);

export default withTranslation()(SimulatingTransactions);
