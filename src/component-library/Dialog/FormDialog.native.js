import React from 'react';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

const FormDialog = ({
  title,
  onClose,
  onSubmit,
  isOpen,
  text,
  labelCancel,
  labelSubmit,
  children,
  isDisabledSubmit,
}) => (
  <Portal>
    <Dialog visible={isOpen} onDismiss={onClose}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{text}</Paragraph>
        {children}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClose}>{labelCancel}</Button>
        <Button onPress={onSubmit} disabled={isDisabledSubmit}>
          {labelSubmit}
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default FormDialog;
