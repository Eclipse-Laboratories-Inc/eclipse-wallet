import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import AppProvider from './AppProvider';
import routes from './routes/app-routes';
import RoutesBuilder from './routes/RoutesBuilder';

const App = () => (
  <AppProvider>
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <RoutesBuilder routes={routes} />
    </SafeAreaView>
  </AppProvider>
);

export default App;
