import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartOverlay = () => {
  const { isOverlayVisible, lastAddedItem } = useCart();

  if (!isOverlayVisible || !lastAddedItem) return null;

  const { name, price } = lastAddedItem;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex h-fit w-[95%] max-w-md -translate-x-1/2 justify-between gap-3 rounded-lg bg-green-600 p-4 text-white shadow-lg md:max-w-lg">
      <div>
        <p className="text-lg font-bold">{name} added to cart</p>
        <span className="text-sm text-gray-200">${price.toFixed(2)}</span>
      </div>
      <Link
        to="/user/cart"
        className="h-fit w-[40%] rounded bg-white px-4 py-2 font-semibold text-green-600 hover:bg-gray-100"
      >
        Go to Cart
      </Link>
    </div>
  );
};

export default CartOverlay;
