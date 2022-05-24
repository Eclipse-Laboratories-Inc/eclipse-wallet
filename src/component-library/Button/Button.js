import React from 'react';
import MUIButton from '@mui/material/Button';

const Button = ({children, onClick}) => (
  <MUIButton variant="contained" onClick={onClick}>
    {children}
  </MUIButton>
);

export const ButtonText = ({text, onClick}) => (
  <MUIButton variant="text" onClick={onClick}>
    {text}
  </MUIButton>
);

export default Button;
