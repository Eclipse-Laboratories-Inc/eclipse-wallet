import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';

const PageLayout = ({ children, theme }) => (
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={{ ...styles.container, backgroundColor: theme.colors.background }}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 12 },
});

export default withTheme(PageLayout);
