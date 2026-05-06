// navigation/MainStack.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FieldScreen from '../screens/FieldScreen';
import BookingScreen from '../screens/BookingScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShopScreen from '../screens/ShopScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentConfirmScreen from '../screens/PaymentConfirmScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PRIMARY = '#4CAF50';

// Placeholder History
function HistoryScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0faf0' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🕓</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 }}>Lịch sử</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>Màn hình đang được phát triển</Text>
        </View>
    );
}

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Field" component={FieldScreen} options={{ title: 'Danh sách sân' }} />
        </Stack.Navigator>
    );
}

function BookingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BookingScreen" component={BookingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

function CartStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CartScreen"
                component={CartScreen}
                options={{ headerShown: false }}
            />

            {/* 👇 THÊM 2 MÀN HÌNH */}
            <Stack.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PaymentConfirm"
                component={PaymentConfirmScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

// ── Shop Stack: Shop → ProductDetail ────────────────────────────
function ShopStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ShopScreen"
                component={ShopScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{
                    headerShown: true,
                    title: 'Chi tiết sản phẩm',
                    headerStyle: { backgroundColor: '#2E7D32' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: '700' },
                    // Dùng header tùy chỉnh nếu muốn ẩn:
                    // headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

const TAB_ICONS = {
    Home: '🏠',
    Booking: '📅',
    Cart: '🛒',
    History: '🕓',
    Shop: '🏪',
    Profile: '👤',
};

const TAB_LABELS = {
    Home: 'Trang chủ',
    Booking: 'Đặt sân',
    Cart: 'Giỏ hàng',
    History: 'Lịch sử',
    Shop: 'Cửa hàng',
    Profile: 'Cá nhân',
};

export default function MainStack() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: PRIMARY,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 62,
                    paddingBottom: 8,
                    paddingTop: 6,
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
                tabBarLabel: TAB_LABELS[route.name] ?? route.name,
                tabBarIcon: () => (
                    <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name] ?? '❓'}</Text>
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Booking" component={BookingStack} />
            <Tab.Screen name="Shop" component={ShopStack} />
            <Tab.Screen name="Cart" component={CartStack} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
