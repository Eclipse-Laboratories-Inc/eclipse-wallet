import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import theme from '../Theme/theme';
import GlobalText from '../Text/GlobalText';

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8 * 2,
    fontSize: theme.fontSize.fontSizeNormal,
    borderRadius: theme.borderRadius.borderRadiusNormal,
  },
  block: {
    alignSelf: 'stretch',
  },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.black300,
  },
  flat: {
    borderRadius: 0,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.labelSecondary,
    backgroundColor: theme.staticColor.transparent,
  },
  outlinedDisabled: {
    borderWidth: 1,
    borderColor: theme.colors.labelSecondary,
    backgroundColor: theme.staticColor.transparent,
    opacity: 0.25,
  },
  outlinedText: {
    color: theme.colors.labelPrimary,
    fontSize: theme.fontSize.fontSizeNormal,
  },
  outlinedIcon: {
    color: theme.colors.labelPrimary,
  },
  disabled: {
    backgroundColor: theme.colors.black300,
  },
  transparent: {
    backgroundColor: theme.staticColor.transparent,
  },
  secondary: {
    color: theme.colors.labelPrimary,
    backgroundColor: theme.colors.gray,
  },
  textButton: {
    color: theme.colors.labelSecondary,
    fontSize: theme.fontSize.fontSizeNormal,
    backgroundColor: theme.staticColor.transparent,
  },
  wide: {
    width: 236,
  },
  icon: {
    paddingRight: 5,
    fontSize: theme.fontSize.fontSizeNormal + 2,
    lineHeight: theme.lineHeight.lineHeightNormal,
    color: theme.colors.white,
  },
  text: {
    fontSize: theme.fontSize.fontSizeNormal,
    lineHeight: theme.lineHeight.lineHeightNormal,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.primary,
    textTransform: 'uppercase',
    backgroundColor: 'transparent',
  },
  disabledText: {
    color: theme.colors.labelSecondary,
  },
  labelSecondary: {
    color: theme.colors.labelSecondary,
  },
});

const GlobalButton = ({
  type,
  color,
  title,
  icon,
  block,
  wide,
  bordered,
  flat,
  outlined,
  disabled,
  transparent,
  style,
  textStyle,
  iconStyle,
  children,
  ...props
}) => {
  const buttonStyle = {
    ...(block ? styles.block : {}),
    ...(wide ? styles.wide : {}),
    ...(bordered ? styles.bordered : {}),
    ...(flat ? styles.flat : {}),
    ...(outlined ? styles.outlined : {}),
    ...(disabled ? styles.disabled : {}),
    ...(outlined && disabled ? styles.outlinedDisabled : {}),
    ...(transparent ? styles.transparent : {}),
  };

  const buttonTextStyle = {
    ...(outlined ? styles.outlinedText : {}),
    ...(disabled ? styles.disabledText : {}),
    ...(outlined && disabled ? styles.outlinedText : {}),
  };

  return (
    <TouchableOpacity disabled={disabled} {...props}>
      <View
        style={[
          styles.button,
          buttonStyle,
          type === 'secondary' && styles.secondary,
          type === 'text' && styles.textButton,
          style,
        ]}>
        {title ? (
          <GlobalText
            style={[
              styles.text,
              buttonTextStyle,
              color === 'secondary' && styles.labelSecondary,
              textStyle,
            ]}>
            {title}
          </GlobalText>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GlobalButton;
