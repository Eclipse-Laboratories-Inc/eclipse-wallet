import React from 'react';
import { Paragraph, Dialog, Portal } from 'react-native-paper';

const SimpleDialog = ({ title, onClose, isOpen, text }) => (
  <Portal>
    <Dialog visible={isOpen} onDismiss={onClose}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{text}</Paragraph>
      </Dialog.Content>
    </Dialog>
  </Portal>
);

export default SimpleDialog;
