import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import GlobalText from './GlobalText';

const styles = StyleSheet.create({ container: { flexDirection: 'row' } });

const GlobalSwitch = ({ checked, onChange, label }) => (
  <View style={styles.container}>
    <Switch value={checked} onValueChange={onChange} color="white" />
    <GlobalText color="primary">{label}</GlobalText>
  </View>
);

export default GlobalSwitch;
