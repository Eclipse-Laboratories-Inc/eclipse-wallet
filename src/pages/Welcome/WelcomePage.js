import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '../../routes/hooks';

import theme from '../../component-library/Theme/theme';
import GlobalLayout from '../../component-library/Layout/GlobalLayout';
import GlobalText from '../../component-library/Text/GlobalText';
import GlobalImage from '../../component-library/Image/GlobalImage';
import GlobalButton from '../../component-library/Button/GlobalButton';

import IconSuccessGradient from '../../assets/images/IconSuccessGradient.png';
import DividerM from '../../assets/images/DividerM.png';
import { ROUTES_MAP } from '../../routes/app-routes';

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
  divider: {
    marginVertical: theme.gutters.paddingXL,
    width: 56,
    height: 8,
  },
  bigIcon: {
    width: 219,
    height: 219,
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
      title:
        '2. 3 lines max Lorem ipsum dolor sit amet, consectetur adipiscing',
      content:
        '2. 2 lines max Excepteur sint occaecat cupidatat non proident, sunt ',
    },
    {
      title:
        '3. 3 lines max Lorem ipsum dolor sit amet, consectetur adipiscing',
      content:
        '3. 2 lines max Excepteur sint occaecat cupidatat non proident, sunt ',
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

          <GlobalImage source={DividerM} style={styles.divider} />

          <GlobalText type="headline2">{steps[step].title}</GlobalText>

          <GlobalText type="body1">{steps[step].content}</GlobalText>
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
