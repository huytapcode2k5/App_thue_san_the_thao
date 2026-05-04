// // navigation/MainStack.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { View, Text } from 'react-native';

// import HomeScreen from '../screens/HomeScreen';
// import FieldListScreen from '../screens/FieldScreen';
// import BookingScreen from '../screens/BookingScreen';
// import ProfileScreen from '../screens/ProfileScreen';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// const PRIMARY = '#4CAF50'; // ✅ dùng thẳng, tránh COLORS undefined

// // ── HistoryScreen & NotificationScreen định nghĩa TRƯỚC khi dùng ──
// function HistoryScreen() {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Lịch sử đặt sân</Text>
//         </View>
//     );
// }

// function NotificationScreen() {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Thông báo</Text>
//         </View>
//     );
// }

// // ── HomeStack ─────────────────────────────────────────────────────
// function HomeStack() {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen
//                 name="HomeScreen"
//                 component={HomeScreen}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="FieldList"
//                 component={FieldListScreen}
//                 options={{ title: 'Danh sách sân' }}
//             />
//             <Stack.Screen
//                 name="Booking"
//                 component={BookingScreen}
//                 options={{ title: 'Đặt sân' }}
//             />
//         </Stack.Navigator>
//     );
// }

// // ── ProfileStack ──────────────────────────────────────────────────
// function ProfileStack() {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen
//                 name="ProfileScreen"
//                 component={ProfileScreen}
//                 options={{ title: 'Cá nhân' }}
//             />
//         </Stack.Navigator>
//     );
// }

// // ── Icon helper ───────────────────────────────────────────────────
// const TAB_ICONS = {
//     Home: '🏠',
//     History: '📅',
//     Notification: '🔔',
//     Profile: '👤',
// };

// // ── MainStack ─────────────────────────────────────────────────────
// export default function MainStack() {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 headerShown: false,
//                 tabBarActiveTintColor: PRIMARY,
//                 tabBarInactiveTintColor: 'gray',
//                 tabBarStyle: {
//                     backgroundColor: '#fff',
//                     height: 60,
//                     paddingBottom: 8,
//                     paddingTop: 8,
//                     borderTopWidth: 1,
//                     borderTopColor: '#e0e0e0',
//                     elevation: 10,
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: -2 },
//                     shadowOpacity: 0.1,
//                     shadowRadius: 4,
//                 },
//                 tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
//                 tabBarIcon: ({ color }) => (
//                     <Text style={{ fontSize: 22 }}>
//                         {TAB_ICONS[route.name] ?? '❓'}
//                     </Text>
//                 ),
//             })}
//         >
//             <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Trang chủ' }} />
//             <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Lịch sử' }} />
//             <Tab.Screen name="Notification" component={NotificationScreen} options={{ title: 'Thông báo' }} />
//             <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Cá nhân' }} />
//         </Tab.Navigator>
//     );
// }