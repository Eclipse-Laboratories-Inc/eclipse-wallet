import React, { useContext, useState } from 'react';

import { withTranslation } from '../../hooks/useTranslations';
import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../Wallet/routes';
import { useNavigation } from '../../routes/hooks';
import { getWalletChain, getWalletName } from '../../utils/wallet';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import SimpleDialog from '../../component-library/Dialog/SimpleDialog';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

const SettingsOptionsPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, config, selectedEndpoints, selectedLanguage },
    { logout, removeWallet },
  ] = useContext(AppContext);
  const [showSingleDialog, setShowSingleDialog] = useState(false);
  const [showAllDialog, setShowAllDialog] = useState(false);
  const walletName = getWalletName(activeWallet.getReceiveAddress(), config);

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SETTINGS);

  const toggleSingleDialog = () => {
    setShowSingleDialog(!showSingleDialog);
  };
  const toggleAllDialog = () => {
    setShowAllDialog(!showAllDialog);
  };
  const handleLogout = () => {
    logout();
    trackEvent({ action: EVENTS_MAP.LOGOUT_ALL_WALLETS });
    navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  };

  const handleRemove = async () => {
    await removeWallet(activeWallet.getReceiveAddress());
    toggleSingleDialog();
    trackEvent({ action: EVENTS_MAP.LOGOUT_WALLET });
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_SELECT);
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

        {/*Not implemented yet
        <CardButton
          title={t(`settings.security`)}
          actionIcon="right"
          onPress={goToSecurity}
        />
         */}

        {/*Not implemented yet
        <CardButton
          title={t(`settings.notifications`)}
          actionIcon="right"
          onPress={goToNofifications}
        />
         */}

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
          type="danger"
          wide
          title={t(`settings.wallets.remove_wallet`)}
          onPress={toggleSingleDialog}
        />

        <GlobalPadding size="sm" />

        <GlobalButton
          type="dangerLight"
          wide
          title={t(`settings.wallets.remove_all_wallets`)}
          onPress={toggleAllDialog}
        />
      </GlobalLayout.Footer>
      <SimpleDialog
        type="danger"
        title={
          <GlobalText center type="headline3" numberOfLines={1}>
            Are your sure?
          </GlobalText>
        }
        btn1Title={`${t('actions.remove')} ${walletName}`}
        btn2Title={t('actions.cancel')}
        onClose={toggleSingleDialog}
        isOpen={showSingleDialog}
        action={handleRemove}
        text={
          <GlobalText center type="body1">
            {t(`settings.wallets.remove_wallet_description`)}
          </GlobalText>
        }
      />
      <SimpleDialog
        type="danger"
        title={
          <GlobalText center type="headline3" numberOfLines={1}>
            Are your sure?
          </GlobalText>
        }
        btn1Title={t('actions.remove_all')}
        btn2Title={t('actions.cancel')}
        onClose={toggleAllDialog}
        isOpen={showAllDialog}
        action={handleLogout}
        text={
          <GlobalText center type="body1">
            {t(`settings.wallets.remove_all_wallets_description`)}
          </GlobalText>
        }
      />
    </GlobalLayout>
  );
};

export default withTranslation()(SettingsOptionsPage);
