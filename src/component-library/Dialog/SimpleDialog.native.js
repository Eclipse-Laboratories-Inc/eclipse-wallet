import React from 'react';
import { View } from 'react-native';
import theme, { globalStyles } from '../../component-library/Global/theme';
import { withTranslation } from '../../hooks/useTranslations';
import GlobalButton from '../Global/GlobalButton';
import GlobalPadding from '../Global/GlobalPadding';

import { Paragraph, Dialog, Portal } from 'react-native-paper';

const SimpleDialog = ({
  type,
  title,
  onClose,
  isOpen,
  action,
  text,
  btn1Title,
  btn2Title,
  t,
}) => (
  <Portal>
    <Dialog
      visible={isOpen}
      onDismiss={onClose}
      style={{ backgroundColor: 'rgba(22,28,45, 0.9)' }}>
      <Dialog.Title style={{ textAlign: 'center' }}>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph style={{ textAlign: 'center' }}>{text}</Paragraph>
        {action && (
          <View>
            <GlobalPadding size="sm" />

            <GlobalButton
              type={type || 'primary'}
              flex
              title={btn1Title}
              onPress={action}
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

export default withTranslation()(SimpleDialog);
