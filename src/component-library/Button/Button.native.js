import React from 'react';
import {Button as PaperButton} from 'react-native-paper';

const Button = ({children, onClick}) => (
  <PaperButton mode="contained" onPress={onClick}>
    {children}
  </PaperButton>
);

export const ButtonText = ({text, onClick}) => (
  <PaperButton onPress={onClick}>{text}</PaperButton>
);

export default Button;
