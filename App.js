import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './store/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { initializeData } from './services/jsonDataService';

// Tăng version này mỗi khi thay đổi data.json để tự động reset
const DATA_VERSION = '2';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const savedVersion = await AsyncStorage.getItem('@data_version');
      if (savedVersion !== DATA_VERSION) {
        // data.json có thay đổi → xóa cache cũ
        await AsyncStorage.clear();
        await AsyncStorage.setItem('@data_version', DATA_VERSION);
      }
      await initializeData();
      setReady(true);
    };
    setup();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2ede5a" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}