import React, { createContext, useContext, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const dispatch = useDispatch();

  const addItemToCart = useCallback(
    (item, triggerNotification = false) => {
      setCartItems((prevItems) => {
        const updatedCart = prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );

        const isItemInCart = prevItems.some(
          (cartItem) => cartItem.id === item.id,
        );
        return isItemInCart
          ? updatedCart
          : [...prevItems, { ...item, quantity: 1 }];
      });

      setLastAddedItem(item);
      dispatch(addToCart(item));

      if (triggerNotification) {
        setIsOverlayVisible(true);
        setTimeout(() => setIsOverlayVisible(false), 3000);
      }
    },
    [dispatch],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        isOverlayVisible,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for consuming the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
