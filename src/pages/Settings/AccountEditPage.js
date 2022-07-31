import React from 'react';
import { View } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButton from '../../component-library/CardButton/CardButton';

import Avatar from '../../assets/images/Avatar.png';
import IconEditCircle from '../../assets/images/IconEditCircle.png';

const AccountEditPage = ({ t }) => {
  const navigate = useNavigation();

  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_SELECT);

  const goToEditProfile = ({ address }) =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE, { address });

  const goToEditName = ({ address }) =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_NAME, { address });

  const goToAddress = ({ address }) =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_ADDRESS, { address });

  const goToWalletNotifications = ({ address }) =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_NOTIFICATIONS, {
      address,
    });

  const goToSeedPhrase = ({ address }) =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_SEEDPHRASE, { address });

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.edit_wallet`)}
        />

        <View style={globalStyles.centered}>
          <View style={globalStyles.floatingTransactionBox}>
            <GlobalImage
              source={Avatar}
              size="4xl"
              style={globalStyles.bigImage}
              circle
            />
            <CardButton
              onPress={goToEditProfile}
              buttonStyle={globalStyles.floatingTransaction}
              transparent>
              <GlobalImage source={IconEditCircle} size="md" circle />
            </CardButton>
          </View>
        </View>

        <GlobalPadding />

        <CardButton
          title={t(`general.name`)}
          actionIcon="right"
          onPress={goToEditName}>
          <GlobalText type="caption">Name detail</GlobalText>
        </CardButton>

        <CardButton
          title={t(`general.address`)}
          actionIcon="right"
          onPress={goToAddress}>
          <GlobalText type="caption">CxpY....NfdsS</GlobalText>
        </CardButton>

        <CardButton
          title={t(`settings.notifications`)}
          actionIcon="right"
          onPress={goToWalletNotifications}
        />

        <CardButton
          title={t(`general.seed_phrase`)}
          actionIcon="right"
          onPress={goToSeedPhrase}
        />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(AccountEditPage);
