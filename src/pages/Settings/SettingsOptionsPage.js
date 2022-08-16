import React, { useContext } from 'react';

import { withTranslation } from '../../hooks/useTranslations';
import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { getWalletChain, getWalletName } from '../../utils/wallet';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';

const SettingsOptionsPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, config, selectedEndpoints, selectedLanguage },
    { logout },
  ] = useContext(AppContext);
  const handleLogout = () => {
    logout();
    navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  };

  const goToAccounts = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_SELECT);

  const goToAddressBook = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ADDRESSBOOK);

  const goToLanguages = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGELANGUAGE);

  const goToNetwork = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGENETWORK);

  const goToSecurity = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_SECURITY);

  const goToNofifications = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_NOTIFICATIONS);

  const goToTrustedApps = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_TRUSTEDAPPS);

  const goToHelpSupport = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_HELPSUPPORT);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle title={t('settings.title')} />

        {activeWallet && (
          <CardButtonWallet
            title={getWalletName(activeWallet.getReceiveAddress(), config)}
            address={activeWallet.getReceiveAddress()}
            chain={getWalletChain(activeWallet)}
            onPress={goToAccounts}
            actionIcon="right"
            selected
          />
        )}

        <GlobalPadding />

        <CardButton
          title={t(`settings.address_book`)}
          actionIcon="right"
          onPress={goToAddressBook}
        />

        <CardButton
          title={t(`settings.display_language`)}
          // description="Lorem impsum"
          actionIcon="right"
          onPress={goToLanguages}>
          <GlobalText type="caption">
            {t(`settings.languages.${selectedLanguage}`)}
          </GlobalText>
        </CardButton>

        <CardButton
          title={t(`settings.change_network`)}
          actionIcon="right"
          onPress={goToNetwork}>
          <GlobalText type="caption">
            {selectedEndpoints[getWalletChain(activeWallet)]}
          </GlobalText>
        </CardButton>

        <CardButton
          title={t(`settings.security`)}
          actionIcon="right"
          onPress={goToSecurity}
        />

        <CardButton
          title={t(`settings.notifications`)}
          actionIcon="right"
          onPress={goToNofifications}
        />

        <CardButton
          title={t(`settings.trusted_apps`)}
          actionIcon="right"
          onPress={goToTrustedApps}
        />

        <CardButton
          title={t(`settings.help_support`)}
          actionIcon="right"
          onPress={goToHelpSupport}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="text"
          block
          title={t(`actions.logout`)}
          color="secondary"
          onPress={handleLogout}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(SettingsOptionsPage);
