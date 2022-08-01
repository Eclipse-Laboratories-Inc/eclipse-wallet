import React, { useState } from 'react';
import { View } from 'react-native';

import { globalStyles } from '../../../component-library/Global/theme';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalInput from '../../../component-library/Global/GlobalInput';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalPageDot from '../../../component-library/Global/GlobalPageDot';

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
  const isValid =
    (!requiredLock && ((!!pass && pass === repass) || (!pass && !repass))) ||
    (requiredLock && pass);
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
      onComplete(pass);
    }
  };
  const onChange = v => {
    setWrongpass(false);
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
            <GlobalText type="headline2" center>
              {t('wallet.create.enter_your_password')}
            </GlobalText>
            <GlobalPadding size="2xl" />

            <GlobalInput
              placeholder={t('wallet.create.enter_your_password')}
              value={pass}
              setValue={onChange}
              invalid={wrongpass}
              autoComplete="password-new"
              secureTextEntry
            />
            {wrongpass && (
              <GlobalText type="body1" color="negative">
                {t('wallet.create.invalid_password')}
              </GlobalText>
            )}
          </>
        )}

        {!requiredLock && (
          <>
            <GlobalText type="headline2" center>
              {t('wallet.create.choose_a_password')}
            </GlobalText>

            <GlobalText type="body1" center>
              {t('wallet.create.choose_a_password_body')}
            </GlobalText>

            <GlobalPadding size="2xl" />

            <GlobalInput
              placeholder={t('wallet.create.passwordNew')}
              value={pass}
              setValue={setPass}
              invalid={false}
              autoComplete="password-new"
              secureTextEntry
            />

            <GlobalPadding />

            <GlobalInput
              placeholder={t('wallet.create.passwordRepeat')}
              value={repass}
              setValue={setRepass}
              invalid={false}
              autoComplete="password-new"
              secureTextEntry
            />
          </>
        )}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalText type="body1" center>
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
          disabled={!isValid || checking || waiting}
        />
      </GlobalLayout.Footer>
    </>
  );
};

export default Password;
