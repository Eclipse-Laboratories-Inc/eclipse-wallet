import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../../AppProvider';
import { getDefaultChain, getDerivedAccounts } from '../../utils/wallet';
import ChooseDerivabes from './components/ChooseDerivabes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_MAP_ADAPTER } from '../Adapter/routes';

const DerivedAccountsPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, selectedEndpoints, isAdapter },
    { addDerivedAccounts },
  ] = useContext(AppContext);
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    getDerivedAccounts(
      getDefaultChain(),
      activeWallet.mnemonic,
      selectedEndpoints[getDefaultChain()],
    ).then(derived => {
      setAccounts(derived.filter(d => d.index));
    });
  }, [activeWallet, selectedEndpoints]);
  const onComplete = async selected => {
    await addDerivedAccounts(
      accounts.filter(a => selected.includes(a.index)),
      null,
      getDefaultChain(),
    );
    navigate(isAdapter ? ROUTES_MAP_ADAPTER.ADAPTER_DETAIL : ROUTES_MAP.WALLET);
  };
  const goToWallet = () =>
    navigate(isAdapter ? ROUTES_MAP_ADAPTER.ADAPTER_DETAIL : ROUTES_MAP.WALLET);

  return (
    <ChooseDerivabes
      accounts={accounts}
      onComplete={onComplete}
      goToWallet={goToWallet}
    />
  );
};

export default withTranslation()(DerivedAccountsPage);
