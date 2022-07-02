import React from 'react';
import TextField from '@mui/material/TextField';

const TextArea = ({ value, setValue, lines, label, disabled }) => {
  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <TextField
      id="outlined-multiline-static"
      label={label}
      multiline
      rows={lines}
      value={value}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default TextArea;
