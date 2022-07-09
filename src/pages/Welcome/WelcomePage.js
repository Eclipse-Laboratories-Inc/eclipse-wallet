import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';
import GlobalDivider from '../../component-library/Global/GlobalDivider';

import IconSuccessGradient from '../../assets/images/IconSuccessGradient.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: theme.gutters.paddingSM,
    paddingVertical: 40,
    maxWidth: theme.variables.mobileWidth,
    minHeight: '100%',
  },
  headerActions: {
    width: '100%',
    alignItems: 'flex-end',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.gutters.paddingNormal,
    maxWidth: 375,
  },
  footerActions: {
    paddingVertical: theme.gutters.responsivePadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigIcon: {
    width: 219,
    height: 219,
  },
  pagination: {
    flexDirection: 'row',
  },
});

const WelcomePage = () => {
  const navigate = useNavigation();
  const [step, setStep] = useState(0);
  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      goToOnboarding();
    }
  };
  const steps = [
    {
      title: '3 lines max Lorem ipsum dolor sit amet, consectetur adipiscing',
      content:
        '2 lines max Excepteur sint occaecat cupidatat non proident, sunt ',
    },
    {
      title: '2. lines max consectetur adipiscing',
      content: '2. lines max cupidatat non proident, sunt ',
    },
    {
      title: '3. lines max Lorem ipsum dolor sit amet,',
      content: '3. lines max Excepteur sint occaecat ',
    },
  ];
  const goToOnboarding = () => navigate(ROUTES_MAP.ONBOARDING);

  return (
    <GlobalLayout>
      <View style={styles.container}>
        <View style={styles.headerActions}>
          <GlobalButton
            type="text"
            color="secondary"
            title="Skip"
            onPress={goToOnboarding}
          />
        </View>

        <View style={styles.inner}>
          <GlobalImage source={IconSuccessGradient} style={styles.bigIcon} />

          <GlobalPadding size="2xl" />

          <GlobalDivider />

          <GlobalText type="headline2">{steps[step].title}</GlobalText>

          <GlobalText type="body1">{steps[step].content}</GlobalText>

          <GlobalPadding size="md" />

          <View style={styles.pagination}>
            <GlobalPageDot active={step === 0} />
            <GlobalPageDot active={step === 1} />
            <GlobalPageDot active={step === 2} />
          </View>
        </View>

        <View style={styles.footerActions}>
          <GlobalButton
            type="secondary"
            wide
            title="Next"
            onPress={nextStep}
            key="next-w-button"
          />
        </View>
      </View>
    </GlobalLayout>
  );
};

export default WelcomePage;
