import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const TransactionsDetailPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);
  const onBack = () => navigate(ROUTES_MAP.TRANSACTIONS_LIST);

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={onBack} title="Transaction Detail" />

      <GlobalPadding />
    </GlobalLayoutForTabScreen>
  );
};

export default TransactionsDetailPage;
