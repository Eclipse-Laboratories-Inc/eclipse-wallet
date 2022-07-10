import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { getChains, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP } from './routes';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';

import AvatarImage from '../../component-library/Image/AvatarImage';

import AppIcon from '../../assets/images/AppIcon.png';
import AppTitle from '../../assets/images/AppTitle.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 56,
    paddingHorizontal: theme.gutters.paddingSM,
    maxWidth: theme.variables.mobileWidth,
  },
  headerActions: {
    width: '100%',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.gutters.paddingNormal,
    maxWidth: 375,
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

const SelectChain = ({ onNext, blockChains }) => {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <View style={styles.headerActions}>
        <GlobalText type="headline3" center>
          Select Blockchain
        </GlobalText>

        <GlobalPadding size="xs" />

        {blockChains.map((chain, index) => (
          <GlobalButtonCard
            key={chain}
            active={index === selected}
            onPress={() => setSelected(index)}
            icon={<AvatarImage url={LOGOS[chain]} size={48} />}
            title={chain}
            description={chain}
          />
        ))}
      </View>

      <GlobalPadding size="xs" />

      <View style={styles.footerActions}>
        <GlobalPadding />

        <GlobalButton
          type="primary"
          wide
          title="Continue"
          onPress={() => onNext(blockChains[selected])}
        />
      </View>
    </>
  );
};

const SelectOptions = () => {
  const navigate = useNavigation();
  const [actionRoute, setActionRoute] = useState();
  const [step, setStep] = useState(0);
  const onSelectAction = action => {
    setActionRoute(action);
    setStep(1);
  };
  const onSelectChain = chain => {
    navigate(actionRoute);
  };

  return (
    <GlobalLayout>
      <View style={styles.container}>
        {step === 0 && <SelectAction onNext={onSelectAction} />}
        {step === 1 && (
          <SelectChain onNext={onSelectChain} blockChains={getChains()} />
        )}
      </View>
    </GlobalLayout>
  );
};

export default SelectOptions;
