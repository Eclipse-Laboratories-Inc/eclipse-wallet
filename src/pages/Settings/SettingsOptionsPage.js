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
  const [{ activeWallet, walletNumber, selectedEndpoints }, { logout }] =
    useContext(AppContext);
  const handleLogout = () => {
    logout();
    navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  };

  const [{ selectedLanguage, languages }, { changeLanguage }] =
    useContext(AppContext);

  const goToAddressBook = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ADDRESSBOOK);
  const goToNetwork = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGENETWORK);
  const goToAccounts = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_SELECT);
  const goToLanguages = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGELANGUAGE);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
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
          actionIcon="right"
          onPress={goToAddressBook}
        />

        <CardButton
          title="Display Language"
          // description="Lorem impsum"
          actionIcon="right"
          onPress={goToLanguages}>
          <GlobalText type="caption">
            {t(`settings.languages.${selectedLanguage}`)}
          </GlobalText>
        </CardButton>

        <CardButton
          title="Change Network"
          actionIcon="right"
          onPress={goToNetwork}>
          <GlobalText type="caption">
            {selectedEndpoints[getWalletChain(activeWallet)]}
          </GlobalText>
        </CardButton>

        <CardButton
          title="Security"
          actionIcon="right"
          onPress={() => {}}
          disabled
        />

        {/* <CardButton
        title="Notifications"
        actionIcon="right"
        onPress={() => {}}
        disabled
      /> */}

        <CardButton
          title="Trusted Apps"
          actionIcon="right"
          onPress={() => {}}
          disabled
        />

        <CardButton
          title="Help & Support"
          actionIcon="right"
          onPress={() => {}}
          disabled
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="text"
          block
          title="Logout"
          color="secondary"
          onPress={handleLogout}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(SettingsOptionsPage);
