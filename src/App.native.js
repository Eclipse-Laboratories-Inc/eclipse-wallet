import React from 'react';
import {SafeAreaView, StatusBar, View, Text, ScrollView} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AppProvider from './AppProvider';
import WelcomePage from './pages/Welcome/WelcomePage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import WalletPage from './pages/Wallet/WalletPage';

const Stack = createNativeStackNavigator();

const App = () => (
  <AppProvider>
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="welcome">
        <Stack.Screen name="welcome" component={WelcomePage} />
        <Stack.Screen name="onboarding" component={OnboardingPage} />
        <Stack.Screen name="wallet" component={WalletPage} />
      </Stack.Navigator>
    </SafeAreaView>
  </AppProvider>
);

export default App;
