import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../Wallet/routes';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import stash from '../../utils/stash';
import { withTranslation } from '../../hooks/useTranslations';

import CardButtonAccount from '../../component-library/CardButton/CardButtonAccount';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalText from '../../component-library/Global/GlobalText';
import SecureDialog from '../../component-library/Dialog/SecureDialog';

const AccountSelectPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { accounts, accountId, locked, requiredLock },
    { removeAccount, changeAccount, checkPassword },
  ] = useContext(AppContext);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [toRemove, setToRemove] = useState([]);
  const addNewAccount = () =>
    navigate(APP_ROUTES_MAP.ONBOARDING, {
      Screen: ONBOARDING_ROUTES_MAP.ONBOARDING_HOME,
    });
  const selectAccount = async ({ id }) => {
    await changeAccount(id);
    navigate(WALLET_ROUTES_MAP.WALLET_OVERVIEW);
  };
  const editAccount = ({ id }) => {
    navigate(ROUTES_MAP.SETTINGS_ACCOUNT_EDIT, { id });
  };
  const toggleRemoveDialog = account => {
    setToRemove(account);
    setShowRemoveDialog(!showRemoveDialog);
  };
  const handleRemoveAccount = async (account, password) => {
    await removeAccount(account.id, password);
    setShowRemoveDialog(!showRemoveDialog);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    !locked && (
      <GlobalLayout>
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={onBack}
            title={t('settings.wallets.your_wallets')}
          />

          {accounts.map(account => (
            <View key={account.id}>
              <CardButtonAccount
                account={account}
                imageSize="md"
                selected={account.id === accountId}
                onPress={() => selectAccount(account)}
                onSecondaryPress={() => editAccount(account)}
                onTertiaryPress={() => toggleRemoveDialog(account)}
              />
              <SecureDialog
                type="danger"
                title={
                  <GlobalText center type="headline3" numberOfLines={1}>
                    Are your sure?
                  </GlobalText>
                }
                btn1Title={`${t('actions.remove')} ${toRemove.name}`}
                btn2Title={t('actions.cancel')}
                onClose={toggleRemoveDialog}
                isOpen={showRemoveDialog}
                action={password => handleRemoveAccount(toRemove, password)}
                text={
                  <GlobalText center type="body1">
                    {t(`settings.wallets.remove_wallet_description`)}
                  </GlobalText>
                }
                requiredLock={requiredLock}
                checkPassword={checkPassword}
                loadPassword={async () => stash.getItem('password')}
              />
            </View>
          ))}
        </GlobalLayout.Header>

        <GlobalLayout.Footer>
          <GlobalButton
            type="primary"
            wide
            title={t('settings.wallets.add_new_wallet')}
            onPress={addNewAccount}
          />
        </GlobalLayout.Footer>
      </GlobalLayout>
    )
  );
};

export default withTranslation()(AccountSelectPage);
