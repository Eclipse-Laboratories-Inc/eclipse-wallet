import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';

const TextInput = ({ label, value, setValue }) => {
  const handleChange = text => {
    setValue(text);
  };
  return (
    <PaperTextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={handleChange}
    />
  );
};

export default TextInput;
