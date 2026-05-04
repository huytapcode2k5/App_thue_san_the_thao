// navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../store/AuthContext';

import AuthStack from './AuthStack';
import MainStack from './MainStack';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {!user ? (
                <AuthStack />
            ) : user.role === 'admin' ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Admin" component={AdminScreen} />
                </Stack.Navigator>
            ) : (
                <MainStack />
            )}
        </NavigationContainer>
    );
}