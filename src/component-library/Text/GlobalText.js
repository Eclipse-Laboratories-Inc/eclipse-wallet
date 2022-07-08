import React from 'react';
import { Text } from 'react-native';

import theme from '../Theme/theme';

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
  headline2: {
    marginBottom: theme.gutters.responsivePadding,
    fontSize: theme.fontSize.fontSizeLG,
    lineHeight: theme.lineHeight.lineHeightLG,
    textAlign: 'center',
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansBold,
  },
  body1: {
    marginBottom: theme.gutters.responsivePadding,
    fontSize: theme.fontSize.fontSizeNormal,
    lineHeight: theme.lineHeight.lineHeightNormal,
    textAlign: 'center',
    color: theme.colors.labelPrimary,
    fontFamily: theme.fonts.dmSansRegular,
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
      type === 'headline2' && styles.headline2,
      type === 'body1' && styles.body1,
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
