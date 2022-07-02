import React from 'react';
import MUIButton from '@mui/material/Button';

const Button = ({ children, onClick, disabled, ...props }) => (
  <MUIButton
    variant="contained"
    onClick={onClick}
    disabled={disabled}
    disableElevation
    {...props}>
    {children}
  </MUIButton>
);

export const ButtonText = ({ text, onClick, disabled, ...props }) => (
  <MUIButton
    variant="text"
    onClick={onClick}
    disabled={disabled}
    disableElevation
    {...props}>
    {text}
  </MUIButton>
);

export default Button;
