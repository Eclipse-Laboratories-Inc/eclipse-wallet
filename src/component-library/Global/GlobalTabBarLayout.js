import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalBackgroundImage from '../../component-library/Global/GlobalBackgroundImage';
import GlobalButton from './GlobalButton';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // backgroundColor: 'green',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabBar: {
    alignItems: 'center',
  },
  tabsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'scroll',
  },
});

export const GlobalTabBar = ({ tabs }) => {
  const [currentTab, setCurrentTab] = useState('Wallet');

  return (
    <View style={styles.tabsContainer}>
      {/* <ScrollView
        horizontal
        contentContainerStyle={styles.scrollViewHorizontal}> */}

      {tabs.map(t => (
        <GlobalButton
          key={`btn-${t.title}`}
          type="tabbar"
          size="medium"
          color={currentTab !== t.title ? 'tertiary' : ''}
          transparent
          title={t.title}
          icon={t.icon}
          onPress={() => {
            t.onClick();
            setCurrentTab(t.title);
          }}
        />
      ))}
      {/* </ScrollView> */}
    </View>
  );
};

const GlobalTabBarLayout = ({ children, tabs }) => (
  <GlobalBackgroundImage>
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* <ScrollView contentContainerStyle={styles.scrollView}> */}
        {children}
        {/* </ScrollView> */}
      </View>
      <View style={styles.bottomTabBar}>
        <GlobalTabBar tabs={tabs} />
      </View>
    </View>
  </GlobalBackgroundImage>
);

export default GlobalTabBarLayout;
