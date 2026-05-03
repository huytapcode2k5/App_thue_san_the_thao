// navigation/MainStack.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FieldListScreen from '../screens/FieldScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="FieldList" component={FieldScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
        </Stack.Navigator>
    );
}

export default function MainStack() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Trang chủ' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
        </Tab.Navigator>
    );
}