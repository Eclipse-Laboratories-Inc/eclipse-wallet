import React from 'react';
import { StyleSheet, Text } from 'react-native';

import theme from './theme';

const styles = StyleSheet.create({
  default: {
    fontSize: theme.fontSize.fontSizeNormal,
    color: theme.colors.black,
    backgroundColor: 'transparent',
  },
  inverse: {
    color: theme.colors.white,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  nospace: {
    marginBottom: 0,
  },
  headline1: {
    marginBottom: theme.gutters.responsivePadding,
    fontSize: theme.fontSize.fontSizeXL,
    lineHeight: theme.lineHeight.lineHeightXL,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
  },
  headline2: {
    marginBottom: theme.gutters.responsivePadding,
    fontSize: theme.fontSize.fontSizeLG,
    lineHeight: theme.lineHeight.lineHeightLG,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
  },
  headline3: {
    marginBottom: theme.gutters.responsivePadding,
    fontSize: theme.fontSize.fontSizeMD,
    lineHeight: theme.lineHeight.lineHeightMD,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
  },
  subtitle1: {
    fontSize: theme.fontSize.fontSizeMD,
    lineHeight: theme.lineHeight.lineHeightMD,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansRegular,
  },
  subtitle2: {
    fontSize: theme.fontSize.fontSizeMD,
    lineHeight: theme.lineHeight.lineHeightMD,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
  },
  body1: {
    fontSize: theme.fontSize.fontSizeNormal,
    lineHeight: theme.lineHeight.lineHeightNormal,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansRegular,
  },
  body2: {
    fontSize: theme.fontSize.fontSizeNormal,
    lineHeight: theme.lineHeight.lineHeightNormal,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
  },
  button: {
    fontSize: theme.fontSize.fontSizeNormal,
    lineHeight: theme.lineHeight.lineHeightNormal,
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
    textTransform: 'uppercase',
    letterSpacing: 0.0125,
  },
  caption: {
    fontSize: theme.fontSize.fontSizeSM,
    lineHeight: theme.lineHeight.lineHeightSM,
    color: theme.colors.labelPrimary,
    letterSpacing: 0.004,
    fontFamily: theme.fonts.dmSansRegular,
  },
  overline: {
    fontSize: theme.fontSize.fontSizeXS,
    lineHeight: theme.lineHeight.lineHeightXS,
    color: theme.colors.labelPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.0125,
  },
  labelPrimary: {
    color: theme.colors.labelPrimary,
  },
  accentPrimary: {
    color: theme.colors.accentPrimary,
  },
  positiveBright: {
    color: theme.colors.positiveBright,
  },
  negativeBright: {
    color: theme.colors.negativeBright,
  },
  negativeLight: {
    color: theme.colors.accentPrimary,
  },
  warning: {
    color: theme.colors.warning,
  },
  warningBright: {
    color: theme.colors.warningBright,
  },
  labelTertiary: {
    color: theme.colors.labelTertiary,
  },
  labelSecondary: {
    color: theme.colors.labelSecondary,
  },
  bgLight: {
    color: theme.colors.bgLight,
  },
});

const GlobalText = ({
  type,
  color,
  inverse,
  center,
  bold,
  italic,
  uppercase,
  nospace,
  style,
  ...props
}) => (
  <Text
    style={[
      styles.default,
      type === 'headline1' && styles.headline1,
      type === 'headline2' && styles.headline2,
      type === 'headline3' && styles.headline3,
      type === 'subtitle1' && styles.subtitle1,
      type === 'subtitle2' && styles.subtitle2,
      type === 'body1' && styles.body1,
      type === 'body2' && styles.body2,
      type === 'button' && styles.button,
      type === 'caption' && styles.caption,
      type === 'overline' && styles.overline,
      color === 'primary' && styles.labelPrimary,
      color === 'accentPrimary' && styles.accentPrimary,
      color === 'secondary' && styles.labelSecondary,
      color === 'tertiary' && styles.labelTertiary,
      color === 'positive' && styles.positiveBright,
      color === 'negative' && styles.negativeBright,
      color === 'negativeLight' && styles.negativeLight,
      color === 'warning' && styles.warning,
      color === 'warningBright' && styles.warningBright,
      color === 'bgLight' && styles.bgLight,
      inverse && styles.inverse,
      center && styles.center,
      bold && styles.bold,
      italic && styles.italic,
      uppercase && styles.uppercase,
      nospace && styles.nospace,
      style,
    ]}
    maxFontSizeMultiplier={1.25}
    {...props}
  />
);

export default GlobalText;
