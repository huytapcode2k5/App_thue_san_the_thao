// App.js
import React, { useEffect } from 'react';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './screens/CartContext';
import { HistoryProvider } from './screens/HistoryContext';
import AppNavigator from './navigation/AppNavigator';
import { initializeData } from './services/jsonDataService';

export default function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    // ✅ Thứ tự quan trọng:
    // AuthProvider → ngoài cùng (cung cấp user cho tất cả)
    // CartProvider → đọc user từ AuthContext
    // HistoryProvider → đọc user từ AuthContext
    <AuthProvider>
      <CartProvider>
        <HistoryProvider>
          <AppNavigator />
        </HistoryProvider>
      </CartProvider>
    </AuthProvider>
  );
}