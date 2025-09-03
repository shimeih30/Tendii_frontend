import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoadingScreen from './src/screens/LoadingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Context
import { AuthProvider } from './src/context/AuthContext';
import { ApiProvider } from './src/context/ApiContext';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ApiProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </ApiProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
