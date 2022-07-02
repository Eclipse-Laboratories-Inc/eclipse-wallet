import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import Button from '../Button/Button';

export const BottomTabs = ({ tabs }) => (
  <View style={styles.tabsContainer}>
    {tabs.map(t => (
      <Button key={`btn-${t.title}`} onClick={t.onClick}>
        {t.title}
      </Button>
    ))}
  </View>
);

const BottomTabsLayout = ({ children, tabs, theme }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  pageContainer: {},
  tabsContainer: { flexDirection: 'row' },
});

export default withTheme(BottomTabsLayout);
