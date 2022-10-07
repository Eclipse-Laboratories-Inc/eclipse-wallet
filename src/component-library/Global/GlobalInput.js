import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';

import IconSearch from '../../assets/images/IconSearch.png';
import IconInteractionGreen from '../../assets/images/IconInteractionGreen.png';
import IconSpinner from '../../assets/images/IconTransactionSending.gif';
import GlobalTextInput from './GlobalTextInput';

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.btnBrandLight,
    borderRadius: theme.borderRadius.borderRadiusMD,
    backgroundColor: theme.colors.bgDarkenFaded,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: theme.gutters.paddingSM,
    color: theme.colors.labelPrimary,
    fontSize: theme.fontSize.fontSizeNormal,
    fontFamily: theme.fonts.dmSansBold,
  },
  multiline: {
    paddingVertical: theme.gutters.paddingSM,
    height: 'auto',
    fontFamily: theme.fonts.dmSansRegular,
  },
  seedphrase: {
    paddingVertical: theme.gutters.paddingLG,
    fontSize: theme.fontSize.fontSizeNormal,
    // lineHeight: 1.5,
    textAlign: 'center',
    wordSpacing: '10px',
  },
  forSearch: {
    // width: 50,
    paddingLeft: theme.gutters.paddingSM,
    // height: '100%',
    // position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    zIndex: 1,
  },
  startLabel: {
    minWidth: 50,
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: theme.colors.btnBrandLight,
  },
  startLabelText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.labelTertiary,
  },
  startLabelFocused: {
    borderColor: theme.colors.danger,
  },
  endAction: {
    minWidth: 50,
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.gutters.paddingXS,
  },
  isFocused: {
    borderColor: theme.colors.labelPrimary,
  },
  invalid: {
    borderColor: theme.colors.danger,
  },
  complete: {
    width: 50,
    height: 50,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeIcon: {
    width: 24,
    height: 24,
  },
});

const GlobalInput = ({
  placeholder,
  forSearch,
  startLabel,
  value,
  setValue,
  invalid,
  number,
  complete,
  action,
  style,
  inputGroupStyles,
  seedphrase,
  multiline,
  numberOfLines,
  validating,
  ...props
}) => {
  const handleChange = event => {
    if (setValue) {
      number
        ? setValue(
            event.nativeEvent.text
              .replace(',', '.')
              .replace(/[^\d\.]/g, '')
              .replace(/\./, 'x')
              .replace(/\./g, '')
              .replace(/x/, '.'),
          )
        : setValue(event.nativeEvent.text);
    }
  };
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputGroup, inputGroupStyles]}>
      {forSearch && (
        <View style={styles.forSearch}>
          <GlobalImage source={IconSearch} size="xs" />
        </View>
      )}

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

      <GlobalTextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          seedphrase && styles.seedphrase,
          invalid && styles.invalid,
          isFocused && styles.isFocused,
          style,
        ]}
        value={value}
        onChange={handleChange}
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

      {action && (
        <View
          style={[
            styles.endAction,
            invalid && styles.invalid,
            isFocused && styles.isFocused,
          ]}>
          {action}
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
      {validating && (
        <View style={styles.complete}>
          <GlobalImage source={IconSpinner} style={styles.completeIcon} />
        </View>
      )}
    </View>
  );
};

export default GlobalInput;
