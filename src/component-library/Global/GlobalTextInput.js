import React from 'react';
import { TextInput } from 'react-native';

const GlobalTextInput = ({ keyboardInput, ...props }) => (
  <TextInput {...props} keyboardInput={keyboardInput} />
);

export default GlobalTextInput;
