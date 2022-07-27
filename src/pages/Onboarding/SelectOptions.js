import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '../../routes/hooks';
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

const SelectAction = ({ onNext }) => (
  <>
    <GlobalLayout.Header>
      <GlobalBackTitle secondaryTitle="Welcome to" />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <GlobalImage source={AppIcon} style={styles.appIconImage} />
      <GlobalImage source={AppTitle} style={styles.appTitleImage} />
    </GlobalLayout.Inner>

    <GlobalLayout.Footer>
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
    </GlobalLayout.Footer>
  </>
);

const SelectChain = ({ onNext, blockChains, onBack }) => (
  <GlobalLayout.Header>
    <GlobalBackTitle onBack={onBack} secondaryTitle="Select Blockchain" />

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
    <GlobalLayout fullscreen>
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
    </GlobalLayout>
  );
};

export default SelectOptions;
