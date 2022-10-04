import React from 'react';
import { TextInput } from 'react-native';

const GlobalTextInput = ({ keyboardInput, onEnter, ...props }) => {
  const handleKeyPress = value => {
    if (onEnter && value.key === 'Enter') {
      onEnter();
    }
  };
  return (
    <TextInput
      {...props}
      onKeyPress={handleKeyPress}
      keyboardInput={keyboardInput}
    />
  );
};

export default GlobalTextInput;
