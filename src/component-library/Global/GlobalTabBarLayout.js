import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import GlobalBackgroundImage from '../../component-library/Global/GlobalBackgroundImage';
import { useCurrentTab } from '../../routes/hooks';
import GlobalButton from './GlobalButton';
import theme from './theme';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollViewHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 32,
    height: 32,
  },
  bottomNavContainer: {
    alignItems: 'center',
  },
  tabsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflowX: 'scroll',
    maxWidth: theme.variables.mobileWidthLG,
    paddingHorizontal: theme.gutters.paddingSM,
  },
});

export const GlobalTabBar = ({ tabs }) => {
  const currentTab = useCurrentTab({ tabs });

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
          iconStyle={styles.iconStyle}
          color={currentTab.title !== t.title ? 'tertiary' : ''}
          transparent
          title={t.title}
          icon={t.icon}
          onPress={() => {
            t.onClick();
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
    <SafeAreaView edges={['bottom']} style={styles.bottomNavContainer}>
      <GlobalTabBar tabs={tabs} />
    </SafeAreaView>
  </GlobalBackgroundImage>
);

export default GlobalTabBarLayout;
