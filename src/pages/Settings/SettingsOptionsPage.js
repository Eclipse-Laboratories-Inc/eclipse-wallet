import React, { useContext, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import useUserConfig from '../../hooks/useUserConfig';
import {
  getWalletChain,
  getWalletName,
  getWalletAvatar,
} from '../../utils/wallet';
import packageInfo from '../../../package.json';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import SimpleDialog from '../../component-library/Dialog/SimpleDialog';
import SecureDialog from '../../component-library/Dialog/SecureDialog';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';
import stash from '../../utils/stash';

const styles = StyleSheet.create({
  appVersion: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

const SettingsOptionsPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, config, selectedEndpoints, selectedLanguage, requiredLock },
    { logout, removeWallet, checkPassword },
  ] = useContext(AppContext);
  const [showSingleDialog, setShowSingleDialog] = useState(false);
  const [showAllDialog, setShowAllDialog] = useState(false);
  const walletName = getWalletName(activeWallet.getReceiveAddress(), config);
  const { version } = packageInfo;
  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.SETTINGS);
  const { explorer } = useUserConfig(
    getWalletChain(activeWallet),
    activeWallet.networkId,
  );

  const toggleSingleDialog = () => {
    setShowSingleDialog(!showSingleDialog);
  };
  const toggleAllDialog = () => {
    setShowAllDialog(!showAllDialog);
  };
  const handleLogout = () => {
    logout();
    trackEvent(EVENTS_MAP.LOGOUT_ALL_WALLETS);
    navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  };

  const handleRemove = async password => {
    await removeWallet(activeWallet.getReceiveAddress(), password);
    toggleSingleDialog();
    trackEvent(EVENTS_MAP.LOGOUT_WALLET);
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

  const goToExplorer = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGEEXPLORER);

  // const goToSecurity = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_SECURITY);

  // const goToNofifications = () =>
  //   navigate(ROUTES_SETTINGS_MAP.SETTINGS_NOTIFICATIONS);

  const goToTrustedApps = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_TRUSTEDAPPS);

  const goToHelpSupport = () =>
    Linking.openURL(`https://salmonwallet.io/support.html`);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle title={t('settings.title')} />

        {activeWallet && (
          <CardButtonWallet
            title={getWalletName(activeWallet.getReceiveAddress(), config)}
            address={activeWallet.getReceiveAddress()}
            chain={getWalletChain(activeWallet)}
            image={getWalletAvatar(activeWallet.getReceiveAddress(), config)}
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
          title={t(`settings.select_explorer`)}
          actionIcon="right"
          onPress={goToExplorer}>
          {explorer && <GlobalText type="caption">{explorer.name}</GlobalText>}
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
      <SecureDialog
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
        requiredLock={requiredLock}
        checkPassword={checkPassword}
        loadPassword={async () => stash.getItem('password')}
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

      <GlobalText
        style={styles.appVersion}
        type="caption"
        italic
        color="secondary">
        {t('settings.app_version', {
          version,
        })}
      </GlobalText>
    </GlobalLayout>
  );
};

export default withTranslation()(SettingsOptionsPage);
