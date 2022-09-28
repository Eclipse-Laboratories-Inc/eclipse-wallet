import React, { useState } from 'react';
import { Linking, View, TouchableOpacity } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';

import theme from '../../component-library/Global/theme';
import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../component-library/Global/GlobalPageDot';
import GlobalDivider from '../../component-library/Global/GlobalDivider';
import Logo from '../Onboarding/components/Logo';

const WelcomePage = ({ t }) => {
  const navigate = useNavigation();
  const [step, setStep] = useState(0);
  const goToTwitter = () => Linking.openURL(`https://twitter.com/salmonwallet`);
  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      goToOnboarding();
    }
  };
  const steps = [
    {
      title: t('wallet.onboarding.title1'),
      content: t('wallet.onboarding.content1'),
    },
    {
      title: t('wallet.onboarding.title2'),
      content: t('wallet.onboarding.content2'),
    },
    {
      title: t('wallet.onboarding.title3'),
      content: (
        <TouchableOpacity style={globalStyles.inline} onPress={goToTwitter}>
          {t('wallet.onboarding.content3')}
          <View style={{ color: theme.colors.labelSecondary }}>
            {t('wallet.onboarding.content3b')}
          </View>
        </TouchableOpacity>
      ),
    },
  ];
  const goToOnboarding = () => navigate(ROUTES_MAP.ONBOARDING);

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header centered>
        <View style={globalStyles.alignEnd}>
          <GlobalButton
            type="text"
            color="secondary"
            title={t('actions.skip')}
            onPress={goToOnboarding}
          />
        </View>
        <GlobalPadding size="4xl" />
        <Logo />

        <GlobalPadding size="2xl" />

        <GlobalDivider />

        <GlobalText type="headline2" center>
          {steps[step].title}
        </GlobalText>

        <GlobalText type="body1" center>
          {steps[step].content}
        </GlobalText>
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <View style={globalStyles.pagination}>
          <GlobalPageDot active={step === 0} />
          <GlobalPageDot active={step === 1} />
          <GlobalPageDot active={step === 2} />
        </View>

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t('actions.next')}
          onPress={nextStep}
          key="next-w-button"
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(WelcomePage);
