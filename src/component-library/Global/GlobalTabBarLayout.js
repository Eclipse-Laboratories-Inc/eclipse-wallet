import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import GlobalBackgroundImage from '../../component-library/Global/GlobalBackgroundImage';
import GlobalButton from './GlobalButton';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollViewHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    <View style={styles.wrapper}>{children}</View>
    <SafeAreaView edges={['bottom']}>
      <GlobalTabBar tabs={tabs} />
    </SafeAreaView>
  </GlobalBackgroundImage>
);

export default GlobalTabBarLayout;
