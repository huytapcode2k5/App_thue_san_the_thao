import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './store/AuthContext';

import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {user ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
}