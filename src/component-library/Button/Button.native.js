import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

const Button = ({ children, onClick, disabled }) => (
  <PaperButton mode="contained" onPress={onClick} disabled={disabled}>
    {children}
  </PaperButton>
);

export const ButtonText = ({ text, onClick, disabled }) => (
  <PaperButton onPress={onClick} disabled={disabled}>
    {text}
  </PaperButton>
);

export default Button;
