import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const BasicSelect = ({ value, setValue, options, label, disabled }) => {
  const handleChange = event => {
    setValue(event.target.value);
  };
  return (
    <Select autoWidth value={value} label={label} onChange={handleChange}>
      {options.map(option => (
        <MenuItem key={`option-${option.value}`} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default BasicSelect;
