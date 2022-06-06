import React, {useState} from 'react';
import {ButtonText} from '../../component-library/Button/Button';
import Card from '../../component-library/Card/Card';
import PageLayout from '../../component-library/Layout/PageLayout';
import {useNavigation} from '../../routes/hooks';
import Logo from '../../images/logo.png';
import {ROUTES_MAP} from '../../routes/app-routes';

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
    {title: 'aaa', content: 'aaa'},
    {title: 'bbb', content: 'bbb'},
    {title: 'ccc', content: 'ccc'},
  ];
  const goToOnboarding = () => navigate(ROUTES_MAP.ONBOARDING);

  return (
    <PageLayout>
      <Card
        headerTitle="Welcome"
        headerSubtitle="Salmon Wallet"
        headerAction={<ButtonText text="Skip" onClick={goToOnboarding} />}
        media={{url: Logo, height: '200', alt: 'logo'}}
        title={steps[step].title}
        content={steps[step].content}
        actions={[
          <ButtonText key="next-w-button" text="Next" onClick={nextStep} />,
        ]}
      />
    </PageLayout>
  );
};

export default WelcomePage;
