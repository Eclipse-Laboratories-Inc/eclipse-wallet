import React, { useContext, useEffect, useState } from 'react';

import GlobalLayout from '../../component-library/Global/GlobalLayout';

import { AppContext } from '../../AppProvider';
import { getDefaultChain, getDerivedAccounts } from '../../utils/wallet';
import ChooseDerivabes from './components/ChooseDerivabes';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';

const DerivedAccounts = () => {
  const navigate = useNavigation();
  const [{ activeWallet, selectedEndpoints }, { addDerivedAccounts }] =
    useContext(AppContext);
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
    navigate(ROUTES_MAP.WALLET);
  };
  return (
    <GlobalLayout fullscreen>
      <ChooseDerivabes accounts={accounts} onComplete={onComplete} />
    </GlobalLayout>
  );
};

export default DerivedAccounts;
