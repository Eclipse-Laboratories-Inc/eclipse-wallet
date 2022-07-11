import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import theme from '../../component-library/Global/theme';
import GlobalBackgroundImage from './GlobalBackgroundImage';

const styles = StyleSheet.create({
  containerForTabs: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.staticColor.transparent,
  },
  scrollViewForTabs: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.staticColor.transparent,
    minHeight: '100%',
  },
  scrollViewForTabsInner: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
    minHeight: '100%',
    padding: theme.gutters.paddingNormal,
    backgroundColor: theme.colors.bgPrimary,
  },
  scrollView: {
    // height: '100%',
    flex: 1,
    alignSelf: 'stretch',
  },
});

export const GlobalLayoutForTabScreen = ({ children, style, ...props }) => (
  <View style={[styles.containerForTabs, style]}>
    <ScrollView contentInsetAdjustmentBehavior="automatic" {...props}>
      <View style={styles.scrollViewForTabsInner}>{children}</View>
    </ScrollView>
  </View>
);

const GlobalLayout = ({ children }) => (
  <GlobalBackgroundImage>
    <ScrollView
      contentContainerStyle={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic">
      {children}
    </ScrollView>
  </GlobalBackgroundImage>
);

export default GlobalLayout;
