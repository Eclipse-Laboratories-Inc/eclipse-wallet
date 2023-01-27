import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '../../../routes/hooks';
import { withTranslation } from '../../../hooks/useTranslations';
import { ROUTES_MAP } from '../../Onboarding/routes';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';

import AppIcon from '../../../assets/images/AppIcon.png';
import AppTitle from '../../../assets/images/AppTitle.png';

const styles = StyleSheet.create({
  appIconImage: {
    marginBottom: 30,
    width: 88,
    height: 88,
  },
  appTitleImage: {
    width: 124,
    height: 26,
  },
});

const AdapterSelect = ({ t }) => {
  const navigate = useNavigation();

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle title={t('adapter.select.title')} />
      </GlobalLayout.Header>

      <GlobalLayout.Inner>
        <GlobalImage source={AppIcon} style={styles.appIconImage} />
        <GlobalImage source={AppTitle} style={styles.appTitleImage} />
      </GlobalLayout.Inner>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create_wallet')}
          onPress={() => navigate(ROUTES_MAP.ONBOARDING_CREATE)}
        />

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.recover_wallet')}
          onPress={() => navigate(ROUTES_MAP.ONBOARDING_RECOVER)}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(AdapterSelect);
