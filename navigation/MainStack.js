// navigation/MainStack.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FieldListScreen from '../screens/FieldScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack cho màn hình Trang chủ (có nhiều màn hình con)
function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false, title: 'Trang chủ' }}
            />
            <Stack.Screen
                name="FieldList"
                component={FieldListScreen}
                options={{ title: 'Danh sách sân' }}
            />
            <Stack.Screen
                name="Booking"
                component={BookingScreen}
                options={{ title: 'Đặt sân' }}
            />
        </Stack.Navigator>
    );
}

// Stack cho màn hình Cá nhân
function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ title: 'Cá nhân' }}
            />
        </Stack.Navigator>
    );
}

export default function MainStack() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? '🏠' : '🏠';
                        return <Text style={{ fontSize: 24, color }}>{iconName}</Text>;
                    } else if (route.name === 'Profile') {
                        iconName = focused ? '👤' : '👤';
                        return <Text style={{ fontSize: 24, color }}>{iconName}</Text>;
                    } else if (route.name === 'History') {
                        iconName = focused ? '📅' : '📅';
                        return <Text style={{ fontSize: 24, color }}>{iconName}</Text>;
                    } else if (route.name === 'Notification') {
                        iconName = focused ? '🔔' : '🔔';
                        return <Text style={{ fontSize: 24, color }}>{iconName}</Text>;
                    }
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ title: 'Trang chủ' }}
            />

            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'Lịch sử' }}
            />

            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{ title: 'Thông báo' }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{ title: 'Cá nhân' }}
            />
        </Tab.Navigator>
    );
}

// TẠO THÊM 2 MÀN HÌNH MỚI (nếu chưa có)

// screens/HistoryScreen.js
function HistoryScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Lịch sử đặt sân</Text>
        </View>
    );
}

// screens/NotificationScreen.js
function NotificationScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Thông báo</Text>
        </View>
    );
}