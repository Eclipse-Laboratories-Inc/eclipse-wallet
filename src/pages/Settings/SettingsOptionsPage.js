import React, { useContext } from 'react';
import { withTranslation } from '../../hooks/useTranslations';

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

const SettingsOptionsPage = ({ t }) => {
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
  const goToLanguages = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGELANGUAGE);
  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle title={t('settings.title')} />

      {activeWallet && (
        <CardButtonWallet
          title={getWalletName(activeWallet, walletNumber)}
          address={activeWallet.getReceiveAddress()}
          chain={getWalletChain(activeWallet)}
          onPress={goToAccounts}
          actionIcon="right"
          selected
        />
      )}

      <GlobalPadding />

      <CardButton
        title="Address Book"
        description="Lorem impsum"
        actionIcon="right"
        onPress={() => {}}
      />

      <CardButton
        title="Display Language"
        description="Lorem impsum"
        actionIcon="right"
        onPress={goToLanguages}
      />

      <CardButton
        title="Change Network"
        description="Lorem impsum"
        actionIcon="right"
        onPress={goToNetwork}
      />

      <CardButton
        title="Security"
        description="Lorem impsum"
        actionIcon="right"
        onPress={() => {}}
      />

      <CardButton
        title="Notifications"
        description="Lorem impsum"
        actionIcon="right"
        onPress={() => {}}
      />

      <CardButton
        title="Trusted Apps"
        description="Lorem impsum"
        actionIcon="right"
        onPress={() => {}}
      />

      <CardButton
        title="Help & Support"
        description="Lorem impsum"
        actionIcon="right"
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

export default withTranslation()(SettingsOptionsPage);
