import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import theme from './theme';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';
import Hoverable from '../Hoverable/Hoverable';

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    alignSelf: 'center',
    paddingHorizontal: theme.gutters.responsivePadding * 0.5,
    borderRadius: theme.borderRadius.borderRadiusNormal,
  },
  defaultText: {
    fontFamily: theme.fonts.dmSansBold,
    fontSize: theme.fontSize.fontSizeNormal,
    textAlign: 'center',
  },
  buttonMD: {
    minHeight: 32,
  },
  tabbar: {
    minWidth: 60,
    minHeight: 80,
    flexDirection: 'column',
    paddingHorizontal: 0,
  },
  tabbarText: {
    marginTop: 2,
    fontSize: theme.fontSize.fontSizeXS,
    lineHeight: theme.lineHeight.lineHeightXS,
  },
  cardButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 60,
    borderWidth: 2,
    borderColor: theme.staticColor.transparent,
    borderRadius: theme.borderRadius.borderRadiusMD,
  },
  cardActive: {
    borderColor: theme.colors.labelSecondary,
  },
  cardSelected: {
    backgroundColor: theme.colors.accentPrimary,
  },
  cardButtonText: {
    textAlign: 'left',
    textTransform: 'none',
  },
  flex: {
    flex: 1,
  },
  block: {
    width: '100%',
    alignSelf: 'stretch',
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
    backgroundColor: theme.colors.cards,
    opacity: 0.5,
  },
  transparent: {
    backgroundColor: theme.staticColor.transparent,
  },
  accent: {
    backgroundColor: theme.colors.accentPrimary,
  },
  accentText: {
    color: theme.colors.labelPrimary,
  },
  primary: {
    backgroundColor: theme.colors.labelPrimary,
  },
  primaryText: {
    color: theme.colors.bgDarken,
  },
  secondary: {
    backgroundColor: theme.colors.cards,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  dangerLight: {
    backgroundColor: theme.colors.accentSecondary,
  },
  secondaryText: {
    color: theme.colors.labelPrimary,
  },
  textButton: {
    color: theme.colors.labelSecondary,
    fontSize: theme.fontSize.fontSizeNormal,
    backgroundColor: theme.staticColor.transparent,
  },
  wide: {
    width: '100%',
    flexGrow: 1,
    maxWidth: theme.variables.buttonMaxWidth,
  },
  wideSmall: {
    width: '100%',
    flexGrow: 1,
    maxWidth: theme.variables.buttonMaxWidthSmall,
  },
  icon: {
    width: 28,
    height: 28,
    paddingRight: 5,
  },
  iconIdle: {
    opacity: 0.35,
  },
  disabledText: {
    color: theme.colors.labelTertiary,
  },
  labelSecondary: {
    color: theme.colors.labelSecondary,
  },
  labelTertiary: {
    color: theme.colors.labelTertiary,
  },
});

const GlobalButton = ({
  touchableStyles,
  type,
  size,
  color,
  title,
  icon,
  block,
  flex,
  wide,
  wideSmall,
  selected,
  active,
  outlined,
  disabled,
  readonly,
  transparent,
  style,
  textStyle,
  iconStyle,
  children,
  ...props
}) => {
  const buttonStyle = {
    ...(block ? styles.block : {}),
    ...(flex ? styles.flex : {}),
    ...(wide ? styles.wide : {}),
    ...(wideSmall ? styles.wideSmall : {}),
    ...(outlined ? styles.outlined : {}),
    ...(size === 'medium' ? styles.buttonMD : {}),
    ...(type === 'accent' ? styles.accent : {}),
    ...(type === 'primary' ? styles.primary : {}),
    ...(type === 'secondary' ? styles.secondary : {}),
    ...(type === 'danger' ? styles.danger : {}),
    ...(type === 'dangerLight' ? styles.dangerLight : {}),
    ...(type === 'text' ? styles.textButton : {}),
    ...(type === 'card' ? styles.cardButton : {}),
    ...(type === 'tabbar' ? styles.tabbar : {}),
    ...(transparent ? styles.transparent : {}),
    ...(selected ? styles.cardSelected : {}),
    ...(active ? styles.cardActive : {}),
    ...(disabled ? styles.disabled : {}),
    ...(readonly ? styles.readonly : {}),
    ...(outlined && disabled ? styles.outlinedDisabled : {}),
  };

  const buttonTextStyle = {
    ...(type === 'accent' ? styles.accentText : {}),
    ...(type === 'primary' ? styles.primaryText : {}),
    ...(type === 'secondary' ? styles.secondaryText : {}),
    ...(type === 'card' ? styles.cardButtonText : {}),
    ...(type === 'tabbar' ? styles.tabbarText : {}),
    ...(color === 'secondary' ? styles.labelSecondary : {}),
    ...(color === 'tertiary' ? styles.labelTertiary : {}),
    ...(outlined ? styles.outlinedText : {}),
    ...(disabled ? styles.disabledText : {}),
  };

  return (
    <Hoverable
      disabled={readonly ? true : disabled}
      style={[
        touchableStyles,
        wide && styles.wide,
        wideSmall && styles.wideSmall,
      ]}
      {...props}>
      <View style={[styles.button, buttonStyle, style]}>
        {icon && (
          <GlobalImage
            source={icon}
            style={[
              styles.icon,
              type === 'tabbar' && color === 'tertiary'
                ? styles.iconIdle
                : null,
              iconStyle,
            ]}
          />
        )}

        {title && type !== 'card' ? (
          <GlobalText
            type="button"
            style={[styles.defaultText, buttonTextStyle, textStyle]}>
            {title}
          </GlobalText>
        ) : (
          children
        )}
      </View>
    </Hoverable>
  );
};

export default GlobalButton;
