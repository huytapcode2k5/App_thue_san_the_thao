// screens/HistoryContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../store/AuthContext";

export const HistoryContext = createContext();

// Key gắn với từng user: '@sport_orders_user1', '@sport_orders_user2'
const storageKey = (userId) => `@sport_orders_${userId}`;

export const HistoryProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  // ── Reset + load lại history mỗi khi user thay đổi ─────────────
  useEffect(() => {
    if (!user?.id) {
      // Logout → xóa sạch state (không xóa AsyncStorage)
      setOrders([]);
      return;
    }

    // Login user mới → load đúng history của user đó
    (async () => {
      try {
        const data = await AsyncStorage.getItem(storageKey(user.id));
        setOrders(data ? JSON.parse(data) : []);
      } catch (e) {
        console.error("Lỗi load history:", e);
        setOrders([]);
      }
    })();
  }, [user?.id]); // chỉ trigger khi đổi user, không phải re-render thường

  // ── Lưu xuống AsyncStorage theo đúng userId ────────────────────
  const persist = async (newOrders) => {
    if (!user?.id) return;
    try {
      await AsyncStorage.setItem(storageKey(user.id), JSON.stringify(newOrders));
    } catch (e) {
      console.error("Lỗi save history:", e);
    }
  };

  const addOrder = (order) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      persist(updated);
      return updated;
    });
  };

  const clearHistory = () => {
    if (!user?.id) return;
    setOrders([]);
    AsyncStorage.removeItem(storageKey(user.id));
  };

  const removeOrder = (id) => {
    setOrders((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persist(updated);
      return updated;
    });
  };

  // ── Stats cho ProfileScreen ─────────────────────────────────────
  const stats = {
    total: orders.length,
    confirmed: orders.filter(
      (o) => o.status === "ĐÃ THANH TOÁN" || o.status === "ĐÃ HOÀN THÀNH"
    ).length,
    pending: orders.filter((o) => o.status === "ĐANG XỬ LÝ").length,
    totalSpent: orders
      .filter((o) => o.status === "ĐÃ THANH TOÁN" || o.status === "ĐÃ HOÀN THÀNH")
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <HistoryContext.Provider
      value={{ orders, addOrder, clearHistory, removeOrder, stats }}
    >
      {children}
    </HistoryContext.Provider>
  );
};