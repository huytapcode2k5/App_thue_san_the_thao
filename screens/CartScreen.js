// screens/CartScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CartScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>🛒</Text>
            <Text style={styles.text}>Giỏ hàng</Text>
            <Text style={styles.sub}>Màn hình đang được phát triển</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0faf0' },
    icon: { fontSize: 48, marginBottom: 12 },
    text: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
    sub: { fontSize: 14, color: '#888' },
});