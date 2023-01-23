import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as ROUTES_MAP_APP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';

import AppIcon from '../../assets/images/AppIcon.png';
import AppTitle from '../../assets/images/AppTitle.png';
import { AppContext } from '../../AppProvider';

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
  appLogo: {
    width: 88,
    height: 88,
    margin: 'auto',
  },
});

const SelectAction = ({ onNext, onBack, onboarded, t }) => {
  return (
    <>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          secondaryTitle={
            onboarded
              ? t('wallet.onboarding.titleOnboarded')
              : t('wallet.onboarding.titleWelcome')
          }
        />
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
          onPress={() => onNext(ROUTES_MAP.ONBOARDING_CREATE)}
          // disabled={!chainCode}
        />

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.recover_wallet')}
          onPress={() => onNext(ROUTES_MAP.ONBOARDING_RECOVER)}
          // disabled={!chainCode}
        />
      </GlobalLayout.Footer>
    </>
  );
};

const SelectOptionsPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ accounts }] = useContext(AppContext);

  const onSelectAction = action => {
    navigate(action);
  };

  const onHomeBack = () => {
    if (accounts.length) {
      navigate(ROUTES_MAP_APP.WALLET);
    } else {
      navigate(ROUTES_MAP_APP.WELCOME);
    }
  };
  return (
    <GlobalLayout fullscreen>
      <SelectAction
        onNext={onSelectAction}
        onBack={onHomeBack}
        onboarded={accounts.length}
        t={t}
      />
    </GlobalLayout>
  );
};

export default withTranslation()(SelectOptionsPage);
