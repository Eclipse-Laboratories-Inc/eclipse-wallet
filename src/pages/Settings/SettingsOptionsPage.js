import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import WalletButton from '../../features/WalletButton/WalletButton';
import { getWalletChain, getWalletName } from '../../utils/wallet';

const SettingsOptionsPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, walletNumber }, { logout }] = useContext(AppContext);
  const handleLogout = () => {
    logout();
    navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  };
  const goToNetwork = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGENETWORK);
  const goToAccounts = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_SELECTACCOUNT);
  return (
    <GlobalLayoutForTabScreen>
      <GlobalText type="headline2" center>
        Settings
      </GlobalText>

      {activeWallet && (
        <WalletButton
          name={getWalletName(activeWallet, walletNumber)}
          address={activeWallet.getReceiveAddress()}
          chain={getWalletChain(activeWallet)}
          onClick={goToAccounts}
          active
        />
      )}

      <GlobalPadding />

      <GlobalButton
        type="primary"
        block
        title="Change Network"
        onPress={goToNetwork}
      />

      <GlobalPadding />

      <GlobalButton
        type="secondary"
        block
        title="Logout"
        onPress={handleLogout}
      />
    </GlobalLayoutForTabScreen>
  );
};

export default SettingsOptionsPage;
