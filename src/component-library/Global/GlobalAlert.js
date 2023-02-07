import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalAlertText from './GlobalAlertText';
import GlobalImage from './GlobalImage';
import GlobalPadding from './GlobalPadding';

import IconSuccessGreen from '../../assets/images/IconSuccessGreen.png';
import IconAlertWarningYellow from '../../assets/images/IconAlertWarningYellow.png';
import IconAlertWarningRed from '../../assets/images/IconAlertWarningRed.png';
import theme from './theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const successStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.alertSuccessBg,
    borderColor: theme.colors.alertSuccessBorder,
    borderWidth: 2,
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
    borderWidth: 2,
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
    borderWidth: 2,
    borderStyle: 'solid',
  },
  text: {
    color: theme.colors.alertErrorFont,
  },
});

const GlobalAlert = ({ type, layout, text, noIcon, children }) => {
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
    <View
      style={[
        styles.container,
        typeStyles.container,
        layout === 'horizontal' ? styles.horizontal : styles.vertical,
      ]}>
      {!noIcon && (
        <>
          <GlobalImage size="xs" source={icon} />
          <GlobalPadding size="sm" />
        </>
      )}
      {text && <GlobalAlertText text={text} type={type} />}
      {children}
    </View>
  );
};
export default GlobalAlert;
