import React from 'react';
import { View, Text } from 'react-native';

export default function HistoryScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 48 }}>🕓</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E7D32' }}>Lịch sử</Text>
            <Text style={{ color: '#888' }}>Màn hình đang được phát triển</Text>
        </View>
    );
}