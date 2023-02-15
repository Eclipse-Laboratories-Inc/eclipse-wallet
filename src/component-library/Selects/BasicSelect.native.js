import React, { useState } from 'react';
import DropDown from 'react-native-paper-dropdown';

const BasicSelect = ({
  value,
  setValue,
  options,
  label,
  style,
  inputProps,
  disabled,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <DropDown
      label={label}
      mode="outlined"
      visible={!disabled && showDropDown}
      showDropDown={() => setShowDropDown(true)}
      onDismiss={() => setShowDropDown(false)}
      value={value}
      setValue={setValue}
      dropDownStyle={style}
      inputProps={inputProps}
      list={options}
    />
  );
};

export default BasicSelect;
