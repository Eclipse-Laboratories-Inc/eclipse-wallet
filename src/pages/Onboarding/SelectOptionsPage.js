import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { getChains, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP as ROUTES_MAP_APP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';
import CardButton from '../../component-library/CardButton/CardButton';

import AvatarImage from '../../component-library/Image/AvatarImage';

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
  touchable: {
    maxWidth: theme.variables.buttonMaxWidth,
  },
});

const SelectAction = ({ onNext, onBack, onboarded, t }) => (
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

const SelectChain = ({ onNext, blockChains, onBack, t }) => (
  <GlobalLayout.Header>
    <GlobalBackTitle
      onBack={onBack}
      secondaryTitle={t('wallet.onboarding.select_blockchain')}
    />

    <GlobalPadding size="xs" />

    {blockChains.map(chain => (
      <CardButton
        key={chain}
        onPress={() => onNext(chain)}
        icon={<AvatarImage url={LOGOS[chain]} size={48} />}
        title={chain}
        touchableStyles={styles.touchable}
      />
    ))}
  </GlobalLayout.Header>
);

const SelectOptionsPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ wallets }] = useContext(AppContext);
  const [actionRoute, setActionRoute] = useState();
  const [step, setStep] = useState(0);
  const onSelectAction = action => {
    setActionRoute(action);
    setStep(1);
  };
  const onSelectChain = chain => {
    navigate(actionRoute, { chainCode: chain });
  };
  const onHomeBack = () => {
    if (wallets.length) {
      navigate(ROUTES_MAP_APP.WALLET);
    } else {
      navigate(ROUTES_MAP_APP.WELCOME);
    }
  };
  return (
    <GlobalLayout fullscreen>
      {step === 0 && (
        <SelectAction
          onNext={onSelectAction}
          onBack={onHomeBack}
          onboarded={wallets.length}
          t={t}
        />
      )}
      {step === 1 && (
        <SelectChain
          onNext={onSelectChain}
          blockChains={getChains()}
          onBack={() => setStep(0)}
          t={t}
        />
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(SelectOptionsPage);
