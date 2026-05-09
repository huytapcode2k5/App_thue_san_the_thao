// navigation/MainStack.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FieldScreen from '../screens/FieldScreen';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import CartScreen from '../screens/CartScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ShopScreen from '../screens/ShopScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentConfirmScreen from '../screens/PaymentConfirmScreen';
import HistoryDetailScreen from '../screens/HistoryDetailScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const BookingStackNav = createNativeStackNavigator();
const CartStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();
const ShopStackNav = createNativeStackNavigator();

const PRIMARY = '#2ede5a';

// ── Home: HomeScreen → FieldList ─────────────────────────────────
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

// ── Booking tab: FieldList ───────────────────────────────────────
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

// ── Cart: CartScreen → Payment → PaymentConfirm ──────────────────
function CartStack() {
    return (
        <CartStackNav.Navigator>
            <CartStackNav.Screen
                name="CartScreen"
                component={CartScreen}
                options={{ headerShown: false }}
            />
            <CartStackNav.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ headerShown: false }}
            />
            <CartStackNav.Screen
                name="PaymentConfirm"
                component={PaymentConfirmScreen}
                options={{ headerShown: false }}
            />
        </CartStackNav.Navigator>
    );
}

// ── Profile: ProfileScreen → EditProfile ─────────────────────────
function ProfileStack() {
    return (
        <ProfileStackNav.Navigator>
            <ProfileStackNav.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <ProfileStackNav.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: false }}
            />
        </ProfileStackNav.Navigator>
    );
}

// ── Shop: ShopScreen → ProductDetail ─────────────────────────────
function ShopStack() {
    return (
        <ShopStackNav.Navigator>
            <ShopStackNav.Screen
                name="ShopScreen"
                component={ShopScreen}
                options={{ headerShown: false }}
            />
            <ShopStackNav.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ headerShown: false }}
            />
        </ShopStackNav.Navigator>
    );
}
const HistoryStackNav = createNativeStackNavigator();

function HistoryStack() {
    return (
        <HistoryStackNav.Navigator>
            <HistoryStackNav.Screen
                name="HistoryScreen"
                component={HistoryScreen}
                options={{ headerShown: false }}
            />

            <HistoryStackNav.Screen
                name="HistoryDetail"
                component={HistoryDetailScreen}
                options={{ headerShown: false }}
            />
        </HistoryStackNav.Navigator>
    );
}

// ── Tab Icons / Labels ───────────────────────────────────────────
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
            <Tab.Screen name="Booking" component={BookingTabStack} />
            <Tab.Screen name="Shop" component={ShopStack} />
            <Tab.Screen name="Cart" component={CartStack} />
            <Tab.Screen name="History" component={HistoryStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

// ── Root Stack: Tab + màn hình overlay toàn app ──────────────────
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
                    headerBackTitle: 'Quay lại',
                }}
            />
        </RootStack.Navigator>
    );
}