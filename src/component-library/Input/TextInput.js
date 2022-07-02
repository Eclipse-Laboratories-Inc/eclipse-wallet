import React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = ({ label, value, setValue }) => {
  const handleChange = event => {
    setValue(event.target.value);
  };
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={handleChange}
    />
  );
};

export default TextInput;
