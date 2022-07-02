import React from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';

const BasicSelect = ({ value, setValue, options, label, disabled }) => (
  <View>
    {options.map(option => (
      <RadioButton
        value="first"
        status={option.value === value ? 'checked' : 'unchecked'}
        onPress={() => setValue(option.value)}
      />
    ))}
  </View>
);

export default BasicSelect;
