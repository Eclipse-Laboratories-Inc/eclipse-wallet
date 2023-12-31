import React, { useContext } from 'react';
import { View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';
import { AppContext } from '../../AppProvider';

const AccountEditProfilePage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ activeAccount }] = useContext(AppContext);

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, {
      id: params.id,
    });
  const onSelectNft = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS, {
      id: params.id,
    });

  const onSelectAvatar = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_AVATARS, {
      id: params.id,
    });

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.set_profile_picture`)}
        />

        <GlobalPadding size="4xl" />
        <View style={globalStyles.centered}>
          <GlobalImage
            source={activeAccount.avatar}
            size="3xl"
            style={globalStyles.bigImage}
            circle
          />
          <GlobalPadding size="xl" />

          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.select_nft')}
            onPress={onSelectNft}
          />

          <GlobalPadding size="md" />

          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.select_avatar')}
            onPress={onSelectAvatar}
          />

          {/*
          <GlobalPadding />
           
          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.upload_photo')}
            onPress={() => {}}
          />
          */}
        </View>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditProfilePage));
