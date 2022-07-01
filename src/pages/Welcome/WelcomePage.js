import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import {ButtonText} from '../../component-library/Button/Button';
import Card from '../../component-library/Card/Card';
import PageLayout from '../../component-library/Layout/PageLayout';
import {useNavigation} from '../../routes/hooks';
import Logo from '../../images/logo.png';
import {ROUTES_MAP} from '../../routes/app-routes';

const styles = StyleSheet.create({
  textButton: {
    fontSize: 16,
  },
  wideButton: {
    width: '100%',
    maxWidth: 236,
  },
  titleStyles: {
    marginBottom: '1rem',
    textAlign: 'center',
    lineHeight: 1.25,
  },
  contentStyles: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
  actionsStyles: {
    marginBottom: 56,
    justifyContent: 'center',
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
    {title: 'bbb', content: 'bbb'},
    {title: 'ccc', content: 'ccc'},
  ];
  const goToOnboarding = () => navigate(ROUTES_MAP.ONBOARDING);

  return (
    <Card
      headerTitle="Welcome"
      headerSubtitle="Salmon Wallet"
      headerAction={
        <ButtonText
          variant="text"
          color="tertiary"
          style={styles.textButton}
          text="Skip"
          onClick={goToOnboarding}
        />
      }
      media={{url: Logo, height: '200', alt: 'logo'}}
      title={steps[step].title}
      content={steps[step].content}
      actions={[
        <ButtonText
          key="next-w-button"
          variant="contained"
          color="secondary"
          style={styles.wideButton}
          text="Next"
          onClick={nextStep}
        />,
      ]}
      titleStyles={styles.titleStyles}
      contentStyles={styles.contentStyles}
      actionsStyles={styles.actionsStyles}
    />
  );
};

export default WelcomePage;
