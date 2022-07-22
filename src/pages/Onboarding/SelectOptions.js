import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { getChains, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP as ROUTES_MAP_APP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';
import CardButton from '../../component-library/CardButton/CardButton';

import AvatarImage from '../../component-library/Image/AvatarImage';

import AppIcon from '../../assets/images/AppIcon.png';
import AppTitle from '../../assets/images/AppTitle.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 40,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
  },
  headerActions: {
    // width: '100%',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.gutters.paddingNormal,
  },
  footerActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    minWidth: theme.variables.buttonMaxWidth,
  },
});

const SelectAction = ({ onNext }) => (
  <>
    <View style={styles.headerActions}>
      <GlobalText type="headline3" center>
        Welcome to
      </GlobalText>
    </View>

    <View style={styles.inner}>
      <GlobalImage source={AppIcon} style={styles.appIconImage} />
      <GlobalImage source={AppTitle} style={styles.appTitleImage} />
    </View>

    <View style={styles.footerActions}>
      <GlobalPadding />

      <GlobalButton
        type="primary"
        wide
        title="Create Wallet"
        onPress={() => onNext(ROUTES_MAP.ONBOARDING_CREATE)}
        // disabled={!chainCode}
      />

      <GlobalPadding size="md" />

      <GlobalButton
        type="secondary"
        wide
        title="Recover Wallet"
        onPress={() => onNext(ROUTES_MAP.ONBOARDING_RECOVER)}
        // disabled={!chainCode}
      />
    </View>
  </>
);

const SelectChain = ({ onNext, blockChains, onBack }) => (
  <>
    <View style={styles.headerActions}>
      <GlobalBackTitle onBack={onBack} title="Select Blockchain" />

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
    </View>
  </>
);

const SelectOptions = () => {
  const navigate = useNavigation();
  const [actionRoute, setActionRoute] = useState();
  const [step, setStep] = useState(0);
  const onSelectAction = action => {
    setActionRoute(action);
    setStep(1);
  };
  const onSelectChain = chain => {
    navigate(actionRoute, { chainCode: chain });
    setStep(0);
  };

  return (
    <GlobalLayout>
      <View style={styles.container}>
        {step === 0 && (
          <SelectAction
            onNext={onSelectAction}
            onBack={() => navigate(ROUTES_MAP_APP.ONBOARDING)}
          />
        )}
        {step === 1 && (
          <SelectChain
            onNext={onSelectChain}
            blockChains={getChains()}
            onBack={() => setStep(0)}
          />
        )}
      </View>
    </GlobalLayout>
  );
};

export default SelectOptions;
