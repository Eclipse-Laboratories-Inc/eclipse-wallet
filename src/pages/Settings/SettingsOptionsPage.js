import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
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
      <GlobalBackTitle title="Settings" />

      {activeWallet && (
        <CardButtonWallet
          title={getWalletName(activeWallet, walletNumber)}
          address={activeWallet.getReceiveAddress()}
          chain={getWalletChain(activeWallet)}
          onPress={goToAccounts}
          goToButton
          active
        />
      )}

      <GlobalPadding />

      <CardButton
        title="Address Book"
        description="Lorem impsum"
        goToButton
        onPress={() => {}}
      />

      <CardButton
        title="Display Language"
        description="Lorem impsum"
        goToButton
        onPress={() => {}}
      />

      <CardButton
        title="Change Network"
        description="Lorem impsum"
        goToButton
        onPress={goToNetwork}
      />

      <CardButton
        title="Security"
        description="Lorem impsum"
        goToButton
        onPress={() => {}}
      />

      <CardButton
        title="Notifications"
        description="Lorem impsum"
        goToButton
        onPress={() => {}}
      />

      <CardButton
        title="Trusted Apps"
        description="Lorem impsum"
        goToButton
        onPress={() => {}}
      />

      <CardButton
        title="Help & Support"
        description="Lorem impsum"
        goToButton
        onPress={() => {}}
      />

      <GlobalPadding size="4xl" />

      <GlobalButton
        type="secondary"
        block
        title="Logout"
        onPress={handleLogout}
      />

      <GlobalPadding size="lg" />
    </GlobalLayoutForTabScreen>
  );
};

export default SettingsOptionsPage;
