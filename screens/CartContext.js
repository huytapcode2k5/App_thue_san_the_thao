import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // =========================
  // STATE
  // =========================
  const [cartItems, setCartItems] = useState([]);

  // =========================
  // THÊM VÀO GIỎ HÀNG
  // =========================
  const addToCart = (product) => {
    setCartItems((prev) => {
      // Kiểm tra đã tồn tại chưa
      const exist = prev.find((i) => i.id === product.id);

      // Nếu đã có → tăng số lượng
      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: i.quantity + product.quantity
              }
            : item
        );
      }

      // Nếu chưa có → thêm mới
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================
  // XÓA 1 ITEM
  // =========================
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =========================
  // TĂNG SỐ LƯỢNG
  // =========================
  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // GIẢM SỐ LƯỢNG
  // =========================
  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  // =========================
  // UPDATE SỐ LƯỢNG
  // =========================
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: qty,
            }
          : item
      )
    );
  };

  // =========================
  // XÓA TOÀN BỘ GIỎ HÀNG
  // =========================
  const clearCart = () => {
    setCartItems([]);
  };

  // =========================
  // TỔNG TIỀN
  // =========================
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // =========================
  // TỔNG SỐ LƯỢNG
  // =========================
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // =========================
  // PROVIDER
  // =========================
  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        updateQuantity,

        clearCart,

        totalPrice,

        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};