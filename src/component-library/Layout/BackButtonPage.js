import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 12,
  },
});

const BackButtonPage = ({ children, onBack }) => (
  <View style={styles.container}>
    <GlobalPadding />

    <GlobalButton type="primary" title="Back" onPress={onBack} />

    <GlobalPadding />

    {children}
  </View>
);

export default BackButtonPage;
