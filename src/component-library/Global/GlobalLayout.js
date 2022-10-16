import React from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  RefreshControl,
} from 'react-native';

import theme, { globalStyles } from '../../component-library/Global/theme';
import { isExtension } from '../../utils/platform';
import GlobalBackgroundImage from './GlobalBackgroundImage';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: isExtension() ? 10 : theme.gutters.paddingNormal,
    paddingBottom: theme.gutters.padding4XL,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
  },
  mainTabContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: theme.gutters.paddingNormal,
    paddingBottom: theme.gutters.padding4XL,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
  },
  mainHeader: {
    // flexGrow: 1,
  },
  mainInner: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.gutters.paddingNormal,
    paddingBottom: theme.gutters.padding2XL,
  },
  mainFooter: {
    paddingTop: theme.gutters.paddingLG,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scrollViewContainer: {
    minHeight: '100%',
  },
  containerForTabs: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.staticColor.transparent,
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
});

const GlobalLayout = ({
  fullscreen,
  style,
  children,
  onRefresh,
  refreshing,
}) => {
  const layoutStyle = {
    ...styles.scrollViewContainer,
    ...style,
  };

  const inner = (
    <>
      <StatusBar barStyle={'light-content'} />
      <ScrollView
        contentContainerStyle={layoutStyle}
        contentInsetAdjustmentBehavior="never"
        {...(onRefresh
          ? {
              refreshControl: (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ),
            }
          : {})}>
        <View
          style={fullscreen ? styles.mainTabContainer : styles.mainContainer}>
          {children}
        </View>
      </ScrollView>
    </>
  );

  return <GlobalBackgroundImage>{inner}</GlobalBackgroundImage>;
};

const Header = ({ centered, children }) => (
  <View style={[styles.mainHeader, centered && globalStyles.centered]}>
    {children}
  </View>
);

const Inner = ({ children }) => (
  <View style={styles.mainInner}>{children}</View>
);

const Footer = ({ inlineFlex, children }) => (
  <View
    style={[styles.mainFooter, inlineFlex && globalStyles.inlineFlexButtons]}>
    {children}
  </View>
);

GlobalLayout.Header = Header;
GlobalLayout.Inner = Inner;
GlobalLayout.Footer = Footer;

export const GlobalLayoutForTabScreen = ({ children, style, ...props }) => (
  <View style={[styles.containerForTabs, style]}>
    <ScrollView contentInsetAdjustmentBehavior="automatic" {...props}>
      <View style={styles.scrollViewForTabsInner}>{children}</View>
    </ScrollView>
  </View>
);

export default GlobalLayout;
