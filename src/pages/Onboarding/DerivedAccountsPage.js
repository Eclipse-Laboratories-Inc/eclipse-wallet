import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../../AppProvider';
import { getDefaultChain, getDerivedAccounts } from '../../utils/wallet';
import ChooseDerivable from './components/ChooseDerivable';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP } from '../../routes/app-routes';
import { getSolanaBalance } from '4m-wallet-adapter/services/solana/solana-balance-service';

const getSolBalances = async (activeWallet, derivAccounts) => {
  const connection = await activeWallet.getConnection();
  const items = {};

  for (const { publicKey } of derivAccounts) {
    const solBalance = await getSolanaBalance(connection, publicKey);
    items[publicKey.toString()] = solBalance;
  }

  return items;
};

const DerivedAccountsPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, selectedEndpoints, isAdapter },
    { addDerivedAccounts },
  ] = useContext(AppContext);

  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    getDerivedAccounts(
      getDefaultChain(),
      activeWallet.mnemonic,
      selectedEndpoints[getDefaultChain()],
    ).then(derived => {
      setAccounts(derived.filter(d => d.index));
    });
  }, [activeWallet, selectedEndpoints]);

  useEffect(() => {
    getSolBalances(activeWallet, accounts).then(accBalance => {
      setBalances(accBalance);
    });
  }, [activeWallet, accounts]);

  const onComplete = async selected => {
    await addDerivedAccounts(
      accounts.filter(a => selected.includes(a.index)),
      null,
      getDefaultChain(),
    );
    navigate(isAdapter ? ROUTES_MAP.ADAPTER : ROUTES_MAP.WALLET);
  };
  const goToWallet = () =>
    navigate(isAdapter ? ROUTES_MAP.ADAPTER : ROUTES_MAP.WALLET);

  return (
    <ChooseDerivable
      accounts={accounts}
      onComplete={onComplete}
      balances={balances}
      goToWallet={goToWallet}
    />
  );
};

export default withTranslation()(DerivedAccountsPage);
