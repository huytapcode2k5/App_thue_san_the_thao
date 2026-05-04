import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CartScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Đang cập nhật...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // căn giữa dọc
        alignItems: 'center',     // căn giữa ngang
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});