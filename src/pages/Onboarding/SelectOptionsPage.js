import React, { useContext, useState } from 'react';
import { StyleSheet, Linking, View } from 'react-native';

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
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import CardButton from '../../component-library/CardButton/CardButton';
import SimpleDialog from '../../component-library/Dialog/SimpleDialog';

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
  appLogo: {
    width: 88,
    height: 88,
    margin: 'auto',
  },
  touchable: {
    maxWidth: theme.variables.buttonMaxWidth,
  },
  disabledAvatar: {
    backgroundColor: '#999',
    opacity: 0.5,
    borderRadius: 50,
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

const ComingSoon = ({ currentChain, comingSoon, setComingSoon, t }) => {
  const goToTwitter = () => Linking.openURL(`https://twitter.com/salmonwallet`);
  const onClose = () => setComingSoon(false);

  return (
    <SimpleDialog
      title={
        <GlobalText center type="headline3" numberOfLines={1}>
          {`${currentChain} ${t('wallet.is_coming_soon')}`}
        </GlobalText>
      }
      onClose={onClose}
      isOpen={comingSoon}
      action={goToTwitter}
      text={
        <GlobalText
          center
          onPress={goToTwitter}
          type="subtitle1"
          numberOfLines={1}>
          stay tuned
        </GlobalText>
      }
      t={t}
    />
  );
};

const SelectChain = ({ onNext, blockChains, onBack, t, onComingSoon }) => (
  <GlobalLayout.Header>
    <GlobalBackTitle
      onBack={onBack}
      secondaryTitle={t('wallet.onboarding.select_blockchain')}
    />

    <GlobalPadding size="md" />

    <GlobalText type="body1" center>
      {t('wallet.onboarding.select_blockchain_text')}
    </GlobalText>

    <GlobalPadding size="md" />

    {blockChains.map(chain => (
      <CardButton
        key={chain}
        onPress={() => onNext(chain)}
        icon={<AvatarImage url={LOGOS[chain]} size={48} />}
        title={chain}
        touchableStyles={styles.touchable}
      />
    ))}
    <CardButton
      key={'NEAR'}
      onPress={() => onComingSoon('NEAR')}
      icon={
        <View style={styles.disabledAvatar}>
          <AvatarImage url={LOGOS.NEAR} size={48} />
        </View>
      }
      title={'NEAR'}
      description={'coming soon'}
      touchableStyles={styles.touchable}
    />
    <CardButton
      key={'ETHEREUM'}
      onPress={() => onComingSoon('ETHEREUM')}
      icon={
        <View style={styles.disabledAvatar}>
          <AvatarImage url={LOGOS.ETHEREUM} size={48} />
        </View>
      }
      title={'ETHEREUM'}
      description={'coming soon'}
      touchableStyles={styles.touchable}
    />
  </GlobalLayout.Header>
);

const SelectOptionsPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ wallets }] = useContext(AppContext);
  const [actionRoute, setActionRoute] = useState();
  const [step, setStep] = useState(0);
  const [comingSoon, setComingSoon] = useState(false);
  const [currentChain, setCurrentChain] = useState(null);
  const onSelectAction = action => {
    setActionRoute(action);
    setStep(1);
  };
  const onSelectChain = chain => {
    navigate(actionRoute, { chainCode: chain });
  };
  const onComingSoon = chain => {
    setCurrentChain(chain);
    setComingSoon(true);
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
        <>
          <SelectChain
            onNext={onSelectChain}
            blockChains={getChains()}
            onBack={() => setStep(0)}
            onComingSoon={onComingSoon}
            t={t}
          />
          <ComingSoon
            currentChain={currentChain}
            comingSoon={comingSoon}
            setComingSoon={setComingSoon}
            t={t}
          />
        </>
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(SelectOptionsPage);
