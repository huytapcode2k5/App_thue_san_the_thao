// App.js

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import MainStack from "./navigation/MainStack";

import { AuthProvider } from "./store/AuthContext";
import { CartProvider } from "./screens/CartContext";
import { HistoryProvider } from "./screens/HistoryContext";

import { initializeData } from "./services/jsonDataService";

export default function App() {
  useEffect(() => {
    // Khởi tạo dữ liệu JSON khi app chạy
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <HistoryProvider>
        <CartProvider>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </CartProvider>
      </HistoryProvider>
    </AuthProvider>
  );
}