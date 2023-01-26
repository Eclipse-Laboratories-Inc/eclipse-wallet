import React from 'react';
import { View } from 'react-native';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import theme from '../Global/theme';
import GlobalText from '../Global/GlobalText';

const BasicRadios = ({ value, setValue, options, label, disabled }) => {
  const handleChange = event => {
    setValue(event.target.value);
  };
  return (
    <FormControl>
      <GlobalText type="body2">{label}</GlobalText>
      <View style={{ paddingHorizontal: theme.gutters.paddingXXS }}>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}>
          {options.map(option => (
            <FormControlLabel
              label={
                <GlobalText type="caption" color="secondary">
                  {option.label}
                </GlobalText>
              }
              value={option.value}
              control={
                <Radio
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 14,
                    },
                  }}
                />
              }
            />
          ))}
        </RadioGroup>
      </View>
    </FormControl>
  );
};

export default BasicRadios;
