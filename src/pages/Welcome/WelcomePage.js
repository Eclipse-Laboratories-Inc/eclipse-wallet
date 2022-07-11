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
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
  },
  containerTop: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerActions: {
    width: '100%',
    alignItems: 'flex-end',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.gutters.paddingNormal,
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
        '2 lines max Excepteur sint occaecat cupidatat non proident, sunt',
    },
    {
      title: '2. lines max consectetur adipiscing',
      content: '2. lines max cupidatat non proident, sunt',
    },
    {
      title: '3. lines max Lorem ipsum dolor sit amet,',
      content: '3. lines max Excepteur sint occaecat',
    },
  ];
  const goToOnboarding = () => navigate(ROUTES_MAP.ONBOARDING);

  return (
    <GlobalLayout>
      <View style={styles.container}>
        <View style={styles.containerTop}>
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

            <GlobalText type="headline2" center>
              {steps[step].title}
            </GlobalText>

            <GlobalText type="body1" center>
              {steps[step].content}
            </GlobalText>
          </View>
        </View>

        <View style={styles.footerActions}>
          <View style={styles.pagination}>
            <GlobalPageDot active={step === 0} />
            <GlobalPageDot active={step === 1} />
            <GlobalPageDot active={step === 2} />
          </View>

          <GlobalPadding size="md" />

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
