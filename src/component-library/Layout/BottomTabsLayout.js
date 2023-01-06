import React from 'react';
import { Button, View } from 'react-native';

export const BottomTabs = ({ tabs }) => (
  <View style={styles.tabsContainer}>
    {tabs.map(t => (
      <Button onClick={t.onClick} key={`btn-${t.title}`}>
        {t.title}
      </Button>
    ))}
  </View>
);

const BottomTabsLayout = ({ children, tabs }) => (
  <View style={styles.container}>
    <View style={styles.container}>{children}</View>
    <BottomTabs tabs={tabs} />
  </View>
);

const styles = {
  container: {
    height: '100vh',
    overflowY: 'scroll',
    overflowX: 'hidden',
    padding: '12px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
  pageContainer: { flexGrow: 1, overflow: 'scroll' },
  tabsContainer: {},
};

export default BottomTabsLayout;
