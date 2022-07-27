import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const EditAccountPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title="Edit Wallet" />
        <GlobalPadding />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default EditAccountPage;
