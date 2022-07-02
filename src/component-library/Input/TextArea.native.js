import React from 'react';
import { TextInput } from 'react-native-paper';

const TextArea = ({ value, setValue, lines, label, disabled }) => {
  const handleChange = text => {
    setValue(text);
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      mode="outlined"
      multiline
      numberOfLines={lines}
      label={label}
      disabled={disabled}
    />
  );
};

export default TextArea;
