import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import GlobalImage from './GlobalImage';
import IconSuccessGreen from '../../assets/images/IconSuccessGreen.png';
import IconAlertWarningYellow from '../../assets/images/IconAlertWarningYellow.png';
import IconAlertWarningRed from '../../assets/images/IconAlertWarningRed.png';
import GlobalAlertText from './GlobalAlertText';
import theme from './theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    marginBottom: 10,
  },
});

const successStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.alertSuccessBg,
    borderColor: theme.colors.alertSuccessBorder,
    borderWidth: '2px',
    borderStyle: 'solid',
  },
  text: {
    color: theme.colors.alertSuccessFont,
  },
});

const errorStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.alertErrorBg,
    borderColor: theme.colors.alertErrorBorder,
    borderWidth: '2px',
    borderStyle: 'solid',
  },
  text: {
    color: theme.colors.alertErrorFont,
  },
});

const warningStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.alertWarningBg,
    borderColor: theme.colors.alertWarningBorder,
    borderWidth: '2px',
    borderStyle: 'solid',
  },
  text: {
    color: theme.colors.alertErrorFont,
  },
});

const GlobalAlert = ({ type, children, text }) => {
  const resolveIcon = () => {
    switch (type) {
      case 'error':
        return IconAlertWarningRed;
      case 'warning':
        return IconAlertWarningYellow;
      case 'info':
        return 'Swap';
      case 'success':
        return IconSuccessGreen;
    }
  };

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

  const icon = resolveIcon(type);
  const typeStyles = resolveStyle(type);

  return (
    <View style={[styles.container, typeStyles.container]}>
      <GlobalImage style={styles.image} size="xs" source={icon} />
      {children && <View>{children}</View>}
      {text && <GlobalAlertText text={text} type={type} />}
    </View>
  );
};
export default GlobalAlert;
