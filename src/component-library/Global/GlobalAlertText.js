import React from 'react';
import { StyleSheet, Text } from 'react-native';
import theme from './theme';

const styles = StyleSheet.create({
  text: {
    lineHeight: '1.5',
    textAlign: 'center',
  },
});

const successStyles = StyleSheet.create({
  text: {
    color: theme.colors.alertSuccessFont,
  },
});

const errorStyles = StyleSheet.create({
  text: {
    color: theme.colors.alertErrorFont,
  },
});

const warningStyles = StyleSheet.create({
  text: {
    color: theme.colors.alertWarningFont,
  },
});

const GlobalAlertText = ({ type, text }) => {
  const resolveStyle = () => {
    switch (type) {
      case 'error':
        return errorStyles;
      case 'warning':
        return warningStyles;
      case 'info':
        return 'Swap';
      case 'success':
        return successStyles;
    }
  };

  const typeStyles = resolveStyle(type);

  return <Text style={[styles.text, typeStyles.text]}>{text}</Text>;
};
export default GlobalAlertText;
