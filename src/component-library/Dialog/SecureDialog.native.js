import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import theme, { globalStyles } from '../../component-library/Global/theme';
import { withTranslation } from '../../hooks/useTranslations';
import GlobalButton from '../Global/GlobalButton';
import GlobalPadding from '../Global/GlobalPadding';
import GlobalText from '../Global/GlobalText';
import GlobalInputWithButton from '../Global/GlobalInputWithButton';

import { Paragraph, Dialog, Portal } from 'react-native-paper';

const SecureDialog = ({
  type,
  title,
  onClose,
  isOpen,
  action,
  text,
  btn1Title,
  btn2Title,
  requiredLock,
  checkPassword,
  loadPassword,
  t,
}) => {
  const [password, setPassword] = useState('');
  const [wrongpass, setWrongpass] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (requiredLock) {
        const psw = await loadPassword();
        if (psw) {
          setPassword(psw);
        } else {
          setShowPasswordInput(true);
        }
      }
    };

    init();
  }, [requiredLock, loadPassword]);

  const onChange = value => {
    setWrongpass(false);
    setPassword(value);
  };

  const onContinue = async () => {
    if (requiredLock) {
      setChecking(true);
      const result = await checkPassword(password);
      if (!result) {
        setWrongpass(true);
        setChecking(false);
      } else {
        action(password);
      }
    } else {
      action(password);
    }
  };

  return (
    <Portal>
      <Dialog
        visible={isOpen}
        onDismiss={onClose}
        style={{ backgroundColor: 'rgba(22,28,45, 0.9)' }}>
        <Dialog.Title style={{ textAlign: 'center' }}>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{ textAlign: 'center' }}>{text}</Paragraph>
          {showPasswordInput && (
            <>
              <GlobalInputWithButton
                placeholder={t('wallet.create.enter_your_password')}
                value={password}
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
              {!wrongpass && <GlobalPadding size="lg" />}
              <GlobalPadding size="md" />
            </>
          )}
          {action && (
            <View>
              <GlobalPadding size="sm" />

              <GlobalButton
                type={type || 'primary'}
                flex
                title={
                  checking ? t('wallet.create.passwordChecking') : btn1Title
                }
                onPress={onContinue}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
              <GlobalPadding size="4xl" />
              <GlobalButton
                type="secondary"
                flex
                title={btn2Title}
                onPress={onClose}
                style={[globalStyles.button, globalStyles.buttonRight]}
                touchableStyles={globalStyles.buttonTouchable}
              />
              <GlobalPadding size="2xl" />
            </View>
          )}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default withTranslation()(SecureDialog);
