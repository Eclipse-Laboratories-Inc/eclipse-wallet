import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalButton from './GlobalButton';
import IconArrowBack from '../../assets/images/IconArrowBack.png';
import theme from './theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.gutters.paddingLG,
  },
  buttonSize: {
    width: 52,
  },
});

const GlobalBackTitle = ({ children, onBack }) => (
  <View style={styles.container}>
    <GlobalButton
      type="icon"
      transparent
      icon={IconArrowBack}
      onPress={onBack}
    />

    {children}

    <View style={styles.buttonSize} />
  </View>
);
export default GlobalBackTitle;
