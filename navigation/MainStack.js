import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FieldScreen from '../screens/FieldScreen';
import BookingScreen from '../screens/BookingScreen';
import CartScreen from '../screens/CartScreen';
<<<<<<< HEAD
import ProfileScreen from '../screens/ProfileScreen';
import ShopScreen from '../screens/ShopScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentConfirmScreen from '../screens/PaymentConfirmScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
=======
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FieldDetailScreen from '../screens/FieldDetailScreen';

>>>>>>> main
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const BookingStackNav = createNativeStackNavigator();
const CartStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const PRIMARY = '#2ede5a';

function HomeStack() {
    return (
        <HomeStackNav.Navigator>
            <HomeStackNav.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <HomeStackNav.Screen
                name="FieldList"
                component={FieldScreen}
                options={{ title: 'Danh sách sân' }}
                initialParams={{ detailRoute: 'FieldDetail' }}
            />
        </HomeStackNav.Navigator>
    );
}

function BookingTabStack() {
    return (
        <BookingStackNav.Navigator>
            <BookingStackNav.Screen
                name="FieldListTab"
                component={FieldScreen}
                options={{ title: 'Đặt sân' }}
                initialParams={{ detailRoute: 'FieldDetail' }}
            />
        </BookingStackNav.Navigator>
    );
}

function CartStack() {
    return (
<<<<<<< HEAD
        <Stack.Navigator>
            <Stack.Screen
=======
        <CartStackNav.Navigator>
            <CartStackNav.Screen
>>>>>>> main
                name="CartScreen"
                component={CartScreen}
                options={{ headerShown: false }}
            />
<<<<<<< HEAD

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
=======
        </CartStackNav.Navigator>
>>>>>>> main
    );
}

function ProfileStack() {
    return (
<<<<<<< HEAD
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
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
=======
        <ProfileStackNav.Navigator>
            <ProfileStackNav.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
        </ProfileStackNav.Navigator>
>>>>>>> main
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

function TabNavigator() {
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
<<<<<<< HEAD
            <Tab.Screen name="Booking" component={BookingStack} />
            <Tab.Screen name="Shop" component={ShopStack} />
=======
            <Tab.Screen name="Booking" component={BookingTabStack} />
>>>>>>> main
            <Tab.Screen name="Cart" component={CartStack} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
<<<<<<< HEAD
=======


export default function MainStack() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="TabNavigator" component={TabNavigator} />
            <RootStack.Screen
                name="FieldDetail"
                component={FieldDetailScreen}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="Booking"
                component={BookingScreen}
                options={{
                    headerShown: true,
                    title: 'Đặt sân',
                    headerBackTitle: 'Quay lại'
                }}
            />
        </RootStack.Navigator>
    );
}
>>>>>>> main
