import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import AppProvider from './AppProvider';
import WelcomePage from './pages/Welcome/WelcomePage';

const App = () => (
  <AppProvider>
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <WelcomePage />
      </ScrollView>
    </SafeAreaView>
  </AppProvider>
);

export default App;
