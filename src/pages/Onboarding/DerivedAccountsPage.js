import React, { useContext, useEffect, useState } from 'react';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import { AppContext } from '../../AppProvider';
import { getDefaultChain, getDerivedAccounts } from '../../utils/wallet';
import ChooseDerivable from './components/ChooseDerivable';
import Password from './components/Password';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP } from '../../routes/app-routes';
import { getSolanaBalance } from '4m-wallet-adapter/services/solana/solana-balance-service';
import stash from '../../utils/stash';

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
    { activeWallet, selectedEndpoints, requiredLock, isAdapter },
    { addDerivedAccounts, checkPassword },
  ] = useContext(AppContext);

  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);
  const [waiting, setWaiting] = useState(false);

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

  const onPasswordComplete = async (selectedAccounts, password) => {
    setWaiting(true);
    await addDerivedAccounts(
      accounts.filter(a => selectedAccounts.includes(a.index)),
      password,
      getDefaultChain(),
    );
    navigate(isAdapter ? ROUTES_MAP.ADAPTER : ROUTES_MAP.WALLET);
  };

  const onChooseComplete = async selectedAccounts => {
    if (requiredLock) {
      const password = await stash.getItem('password');
      if (password) {
        await onPasswordComplete(selectedAccounts, password);
      } else {
        setSelected(selectedAccounts);
        setStep(2);
      }
    } else {
      await onPasswordComplete(selectedAccounts, null);
    }
  };
  const goToWallet = () => navigate(ROUTES_MAP.WALLET);
  const goToAdapter = () => navigate(ROUTES_MAP.ADAPTER);

  if (step === 2) {
    return (
      <GlobalLayout fullscreen>
        <Password
          type="recover"
          onComplete={password => onPasswordComplete(selected, password)}
          onBack={() => setStep(1)}
          requiredLock={requiredLock}
          checkPassword={checkPassword}
          waiting={waiting}
          t={t}
        />
      </GlobalLayout>
    );
  }

  return (
    <ChooseDerivable
      accounts={accounts}
      onComplete={onChooseComplete}
      balances={balances}
      goToWallet={!isAdapter ? goToWallet : undefined}
      goToAdapter={isAdapter ? goToAdapter : undefined}
    />
  );
};

export default withTranslation()(DerivedAccountsPage);
