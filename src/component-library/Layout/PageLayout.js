import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 12 },
});

const PageLayout = ({ children }) => (
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={{ ...styles.container }}>
    {children}
  </ScrollView>
);

export default PageLayout;
