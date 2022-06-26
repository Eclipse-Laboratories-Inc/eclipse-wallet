import React from 'react';
import MUIButton from '@mui/material/Button';

const Button = ({children, onClick, disabled}) => (
  <MUIButton variant="contained" onClick={onClick} disabled={disabled}>
    {children}
  </MUIButton>
);

export const ButtonText = ({text, onClick, disabled}) => (
  <MUIButton variant="text" onClick={onClick} disabled={disabled}>
    {text}
  </MUIButton>
);

export default Button;
