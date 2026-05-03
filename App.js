// App.js (THÊM PHẦN KHỞI TẠO DATA)
import React, { useEffect } from 'react';
import { AuthProvider } from './store/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { initializeData } from './services/jsonDataService';

export default function App() {
  useEffect(() => {
    // Khởi tạo dữ liệu JSON lần đầu chạy app
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}