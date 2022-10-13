import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

const GlobalSwitch = ({ checked, onChange, label }) => (
  <FormControlLabel
    control={<Switch checked={checked} onChange={onChange} size="small" />}
    label={label}
  />
);

export default GlobalSwitch;
