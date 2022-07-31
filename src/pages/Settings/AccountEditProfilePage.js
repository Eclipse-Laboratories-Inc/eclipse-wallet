import React from 'react';
import { View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';

import Avatar from '../../assets/images/Avatar.png';

const AccountEditProfilePage = ({ t }) => {
  const navigate = useNavigation();

  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.set_profile_picture`)}
        />

        <View style={globalStyles.centered}>
          <GlobalImage
            source={Avatar}
            size="4xl"
            style={globalStyles.bigImage}
            circle
          />

          <GlobalPadding />

          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.select_nft')}
            onPress={() => {}}
          />

          <GlobalPadding />

          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.upload_photo')}
            onPress={() => {}}
          />

          <GlobalPadding size="4xl" />
          <GlobalPadding size="4xl" />
          <GlobalPadding size="4xl" />

          <View style={globalStyles.squareRatio}>
            <GlobalImage
              source={Avatar}
              style={globalStyles.bigImage}
              square
              squircle
            />
          </View>

          <GlobalPadding size="xl" />

          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.select_nft_to_profile')}
            onPress={() => {}}
          />

          <GlobalPadding />

          <GlobalButton
            type="secondary"
            wideSmall
            title={t('settings.wallets.full_nft_description')}
            onPress={() => {}}
          />

          <GlobalPadding />

          <GlobalButton
            type="secondary"
            wideSmall
            title={t('general.home')}
            onPress={onBack}
          />

          <GlobalPadding />
        </View>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(AccountEditProfilePage);
