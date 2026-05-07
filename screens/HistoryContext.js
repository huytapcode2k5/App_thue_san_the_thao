// screens/HistoryContext.js

import React, { createContext, useState } from "react";

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // =========================
  // THÊM ĐƠN HÀNG
  // =========================
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  // =========================
  // XÓA TOÀN BỘ LỊCH SỬ
  // =========================
  const clearHistory = () => {
    setOrders([]);
  };

  // =========================
  // XÓA 1 ĐƠN HÀNG
  // =========================
  const removeOrder = (id) => {
    setOrders((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <HistoryContext.Provider
      value={{
        orders,
        addOrder,
        clearHistory,
        removeOrder,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};