import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage if exists
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (figurine) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === figurine._id);
      if (existing) {
        // Increase quantity if already in cart
        return prev.map((item) =>
          item._id === figurine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...figurine, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return; // prevent 0 or negative quantities
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
