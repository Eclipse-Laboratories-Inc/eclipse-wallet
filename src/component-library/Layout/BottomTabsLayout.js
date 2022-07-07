import React from 'react';

export const BottomTabs = ({ tabs }) => (
  <div style={styles.tabsContainer}>
    {tabs.map(t => (
      <button onClick={t.onClick} key={`btn-${t.title}`}>
        {t.title}
      </button>
    ))}
  </div>
);

const BottomTabsLayout = ({ children, tabs }) => (
  <div style={styles.container}>
    <div style={styles.container}>{children}</div>
    <BottomTabs tabs={tabs} />
  </div>
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
