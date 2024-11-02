import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/components/Home';
import Login from './src/components/Login';
import Register from './src/components/Register';
import UserProfile from './src/components/UserProfile';
import ProjectDetails from './src/components/ProjectDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}