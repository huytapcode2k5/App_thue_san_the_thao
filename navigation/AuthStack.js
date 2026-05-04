// navigation/AuthStack.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function ForgotPasswordScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>🔑</Text>
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.sub}>Tính năng đang được phát triển</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>← Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0faf0' },
    icon: { fontSize: 48, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
    sub: { fontSize: 14, color: '#888', marginBottom: 32 },
    btn: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}