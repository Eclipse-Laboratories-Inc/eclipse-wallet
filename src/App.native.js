import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AppProvider from './AppProvider';
import AppRoutes from './AppRoutes';
import theme from './component-library/Global/theme';

const App = () => (
  <AppProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <AppRoutes />
    </SafeAreaView>
  </AppProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
});

export default App;
