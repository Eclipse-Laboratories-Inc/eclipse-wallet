import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import GlobalBackgroundImage from '../../component-library/Image/GlobalBackgroundImage';

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
    alignSelf: 'stretch',
  },
});

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
