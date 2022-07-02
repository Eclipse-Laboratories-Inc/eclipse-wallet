import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import Button from '../Button/Button';

const BackButtonPage = ({ theme, children, onBack }) => (
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={{ ...styles.container, backgroundColor: theme.colors.background }}>
    <Button onClick={onBack}>BACK</Button>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 12 },
});

export default withTheme(BackButtonPage);
