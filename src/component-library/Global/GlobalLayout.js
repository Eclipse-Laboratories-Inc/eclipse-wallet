import React from 'react';
import { StyleSheet, StatusBar, ScrollView, View } from 'react-native';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalBackgroundImage from './GlobalBackgroundImage';

const isExtension = process.env.REACT_APP_IS_EXTENSION || false;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: isExtension ? 10 : theme.gutters.paddingNormal,
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
});

const GlobalLayout = ({ fullscreen, children }) => {
  const inner = (
    <>
      <StatusBar barStyle={'light-content'} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        contentInsetAdjustmentBehavior="never">
        <View
          style={fullscreen ? styles.mainTabContainer : styles.mainContainer}>
          {children}
        </View>
      </ScrollView>
    </>
  );

  return (
    <>
      {fullscreen && <GlobalBackgroundImage>{inner}</GlobalBackgroundImage>}
      {!fullscreen && inner}
    </>
  );
};

const Header = ({ children }) => (
  <View style={styles.mainHeader}>{children}</View>
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

export default GlobalLayout;
