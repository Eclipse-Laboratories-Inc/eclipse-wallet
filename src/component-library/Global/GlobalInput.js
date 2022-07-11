import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import theme from './theme';
import GlobalText from './GlobalText';
import GlobalImage from './GlobalImage';

import IconInteractionGreen from '../../assets/images/IconInteractionGreen.png';

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: theme.gutters.paddingSM,
    color: theme.colors.labelPrimary,
    fontSize: theme.fontSize.fontSizeNormal,
    fontFamily: theme.fonts.dmSansBold,
    borderWidth: 1,
    borderColor: theme.colors.btnBrandLight,
    borderRadius: theme.borderRadius.borderRadiusMD,
    backgroundColor: theme.colors.bgDarken,
  },
  multiline: {
    paddingVertical: theme.gutters.paddingSM,
    height: 'auto',
    fontFamily: theme.fonts.dmSansRegular,
  },
  seedphrase: {
    paddingVertical: theme.gutters.paddingLG,
    fontSize: theme.fontSize.fontSizeMD,
    textAlign: 'center',
  },
  startLabel: {
    width: 50,
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: theme.colors.btnBrandLight,
    opacity: 0.9,
  },
  startLabelText: {
    color: theme.colors.labelTertiary,
  },
  startLabelFocused: {
    borderColor: theme.colors.danger,
  },
  isFocused: {
    borderColor: theme.colors.labelPrimary,
  },
  invalid: {
    borderColor: theme.colors.danger,
  },
  withStartLabel: {
    paddingLeft: 64,
  },
  complete: {
    width: 50,
    height: '100%',
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeInput: {
    paddingRight: 42,
  },
  completeIcon: {
    width: 24,
    height: 24,
  },
});

const GlobalInput = ({
  placeholder,
  startLabel,
  value,
  setValue,
  invalid,
  complete,
  style,
  seedphrase,
  multiline,
  numberOfLines,
  ...props
}) => {
  const handleChange = event => {
    setValue ? setValue(event.target.value) : null;
  };
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          seedphrase && styles.seedphrase,
          startLabel && styles.withStartLabel,
          invalid && styles.invalid,
          isFocused && styles.isFocused,
          complete && styles.completeInput,
          style,
        ]}
        value={value}
        onChange={handleChange ? handleChange : () => {}}
        placeholder={placeholder}
        maxFontSizeMultiplier={1.4}
        autoCorrect={false}
        placeholderTextColor={theme.colors.btnBrandLight}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        {...props}
      />
      {startLabel && (
        <View
          style={[
            styles.startLabel,
            invalid && styles.invalid,
            isFocused && styles.isFocused,
          ]}>
          <GlobalText
            type="body2"
            selectable={false}
            style={styles.startLabelText}>
            {startLabel}
          </GlobalText>
        </View>
      )}
      {complete && (
        <View style={styles.complete}>
          <GlobalImage
            source={IconInteractionGreen}
            style={styles.completeIcon}
          />
        </View>
      )}
    </View>
  );
};

export default GlobalInput;
