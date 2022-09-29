import React, { useState } from 'react';
import { View, Linking } from 'react-native';

import { isExtension } from '../../../utils/platform';
import theme from '../../../component-library/Global/theme';
import { globalStyles } from '../../../component-library/Global/theme';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalInputWithButton from '../../../component-library/Global/GlobalInputWithButton';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../../component-library/Global/GlobalPageDot';
import Logo from './Logo';

const Password = ({
  onComplete,
  onBack,
  requiredLock,
  checkPassword,
  waiting,
  t,
}) => {
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');
  const [wrongpass, setWrongpass] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const isValid =
    (!requiredLock && ((!!pass && pass === repass) || (!pass && !repass))) ||
    (requiredLock && pass);

  const validatePasswordStrength = password => {
    const minLength = 8;
    const maxLength = 20;

    return (
      password && password.length >= minLength && password.length <= maxLength
    );
  };

  const onPressTerms = () => {
    Linking.openURL(`https://salmonwallet.io/tc.html`);
  };

  const onContinue = async () => {
    if (requiredLock) {
      setChecking(true);
      const result = await checkPassword(pass);
      if (!result) {
        setWrongpass(true);
        setChecking(false);
      } else {
        onComplete(pass);
      }
    } else {
      await onComplete(pass);
    }
  };
  const onChange = v => {
    if (requiredLock) {
      setWrongpass(false);
    } else {
      const isStrongPassword = validatePasswordStrength(v);

      if (isStrongPassword) {
        setWrongpass(false);
      } else {
        setWrongpass(true);
        setChecking(false);
      }
    }

    setPass(v);
  };
  return (
    <>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack}>
          <View style={globalStyles.pagination}>
            <GlobalPageDot />
            <GlobalPageDot />
            <GlobalPageDot active />
          </View>
        </GlobalBackTitle>

        {requiredLock && (
          <>
            <Logo size={isExtension() ? 'sm' : null} />

            <GlobalPadding size={isExtension() ? 'lg' : '2xl'} />
            <GlobalText type="headline2" center>
              {t('wallet.create.enter_your_password')}
            </GlobalText>
            <GlobalPadding size="2xl" />

            <GlobalInputWithButton
              placeholder={t('wallet.create.enter_your_password')}
              value={pass}
              setValue={onChange}
              actionIcon={showValue ? 'show' : 'hide'}
              onActionPress={() => setShowValue(!showValue)}
              invalid={wrongpass}
              autoComplete="password-new"
              secureTextEntry={!showValue}
            />
            {wrongpass && (
              <GlobalText
                type="body1"
                color="negative"
                style={{ paddingHorizontal: theme.gutters.paddingXS }}>
                {t('wallet.create.invalid_password')}
              </GlobalText>
            )}
          </>
        )}

        {!requiredLock && (
          <>
            <Logo size={isExtension() ? 'sm' : null} />

            <GlobalPadding size={isExtension() ? 'lg' : '2xl'} />

            <GlobalText type="headline2" center>
              {t('wallet.create.choose_a_password')}
            </GlobalText>

            <GlobalText type="body1" center>
              {t('wallet.create.choose_a_password_body')}
            </GlobalText>

            <GlobalPadding size="2xl" />

            <GlobalInputWithButton
              placeholder={t('wallet.create.passwordNew')}
              value={pass}
              setValue={onChange}
              actionIcon={showValue ? 'show' : 'hide'}
              onActionPress={() => setShowValue(!showValue)}
              invalid={wrongpass}
              autoComplete="password-new"
              secureTextEntry={!showValue}
            />

            <GlobalPadding />

            <GlobalInputWithButton
              placeholder={t('wallet.create.passwordRepeat')}
              value={repass}
              setValue={setRepass}
              invalid={pass === repass}
              autoComplete="password-new"
              secureTextEntry={!showValue}
            />

            {(wrongpass || !isValid) && (
              <GlobalText
                type="body1"
                color="negative"
                style={{ padding: theme.gutters.paddingXS }}>
                {wrongpass
                  ? t('wallet.create.wrong_password')
                  : repass && t('wallet.create.passwords_dont_match')}
              </GlobalText>
            )}
          </>
        )}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalText onPress={onPressTerms} type="body1" center>
          {t('wallet.create.i_accept_terms_conditions')}
        </GlobalText>
        <GlobalPadding size="xl" />

        <GlobalButton
          type="primary"
          wide
          title={
            checking
              ? t('wallet.create.passwordChecking')
              : t('wallet.create_wallet')
          }
          onPress={onContinue}
          disabled={!isValid || checking || waiting || wrongpass}
        />
      </GlobalLayout.Footer>
    </>
  );
};

export default Password;
