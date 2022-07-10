import React from 'react';
import { Text } from 'react-native';

import theme from './theme';

const styles = {
  default: {
    fontSize: theme.variables.fontSizeNormal,
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
};

const GlobalText = ({
  type,
  color,
  inverse,
  center,
  bold,
  style,
  ...props
}) => (
  <Text
    style={[
      styles.default,
      type === 'headline1' && styles.headline1,
      type === 'headline2' && styles.headline2,
      type === 'headline3' && styles.headline3,
      type === 'body1' && styles.body1,
      type === 'body2' && styles.body2,
      type === 'button' && styles.button,
      type === 'caption' && styles.caption,
      type === 'overline' && styles.overline,
      color === 'labelPrimary' && styles.labelPrimary,
      inverse && styles.inverse,
      center && styles.center,
      bold && styles.bold,
      style,
    ]}
    maxFontSizeMultiplier={1.25}
    {...props}
  />
);

export default GlobalText;
