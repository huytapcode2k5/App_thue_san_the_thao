// context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../store/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // ── Reset giỏ hàng mỗi khi user thay đổi (login / logout) ──────
  // Khi user = null  → vừa logout  → xóa cart
  // Khi user = {...} → vừa login   → load cart của user đó (hoặc [] nếu mới)
  useEffect(() => {
    setCartItems([]);
  }, [user?.id]); // chỉ trigger khi id thay đổi, không phải re-render thông thường

  // ─────────────────────────────────────────────────────────────────
  const addToCart = (product) => {
    // Chặn thêm vào giỏ khi chưa đăng nhập
    if (!user) return { success: false, error: "Vui lòng đăng nhập để thêm vào giỏ hàng" };

    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    return { success: true };
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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