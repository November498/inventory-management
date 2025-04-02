import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import bag1 from "/bags/bag-1.webp";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleRemoveFromCart = (productId) =>
    dispatch(removeFromCart(productId));

  const handleQuantityChange = (productId, quantity, stock) => {
    if (quantity > stock) {
      alert(`Only ${stock} items left in stock.`);
    } else if (quantity >= 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleProceedToPayment = () => {
    if (!userInfo) {
      alert("Please log in to proceed to payment.");
      navigate("/login");
    } else {
      navigate("/user/payment");
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="cart-page container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-black">
        Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <EmptyCartMessage />
      ) : (
        <>
          <CartItems
            cartItems={cartItems}
            handleRemoveFromCart={handleRemoveFromCart}
            handleQuantityChange={handleQuantityChange}
          />
          <CartSummary
            totalAmount={totalAmount}
            handleClearCart={() => dispatch(clearCart())}
            handleProceedToPayment={handleProceedToPayment}
          />
        </>
      )}
    </div>
  );
};

const EmptyCartMessage = () => (
  <p className="text-center text-lg">
    Your cart is empty.{" "}
    <Link to="/" className="text-black hover:underline">
      Continue shopping
    </Link>
  </p>
);

const CartItems = ({
  cartItems,
  handleRemoveFromCart,
  handleQuantityChange,
}) => (
  <div className="space-y-8">
    {cartItems.map((item) => (
      <CartItem
        key={item.id}
        item={item}
        handleRemoveFromCart={handleRemoveFromCart}
        handleQuantityChange={handleQuantityChange}
      />
    ))}
  </div>
);

const CartItem = ({ item, handleRemoveFromCart, handleQuantityChange }) => (
  <div className="flex flex-col items-center justify-between gap-2 border-b pb-8 md:flex-row">
    <img
      src={item.product_image || bag1}
      alt={item.name}
      className="mb-4 h-32 w-32 object-cover md:mb-0 md:mr-8"
    />
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-2xl font-semibold text-black">{item.name}</h2>
      <p className="text-gray-600">Wallet with chain</p>
      <p className="font-bold text-gray-400">Style #{item.id}</p>
      <p className="font-bold text-gray-400">
        Price ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
    <QuantityControl item={item} handleQuantityChange={handleQuantityChange} />
    <button
      onClick={() => handleRemoveFromCart(item.id)}
      className="flex h-10 w-fit items-center justify-center border border-red-600 px-4 font-bold text-red-600"
    >
      Remove
    </button>
  </div>
);

const QuantityControl = ({ item, handleQuantityChange }) => (
  <div className="flex items-center">
    <button
      onClick={() =>
        handleQuantityChange(item.id, item.quantity - 1, item.threshold)
      }
      className="flex h-10 w-10 items-center justify-center border border-black font-bold text-black"
    >
      -
    </button>
    <input
      type="number"
      min="0"
      max={item.threshold}
      value={item.quantity}
      onChange={(e) =>
        handleQuantityChange(
          item.id,
          parseInt(e.target.value, 10),
          item.threshold,
        )
      }
      className="h-10 w-12 border border-gray-300 px-2 py-1 text-center"
    />
    <button
      onClick={() =>
        handleQuantityChange(item.id, item.quantity + 1, item.threshold)
      }
      className="flex h-10 w-10 items-center justify-center border border-black font-bold text-black"
    >
      +
    </button>
  </div>
);

const CartSummary = ({
  totalAmount,
  handleClearCart,
  handleProceedToPayment,
}) => (
  <div className="mt-12 flex flex-col gap-4 text-center">
    <div className="text-2xl font-bold">
      Total Amount: ${totalAmount.toFixed(2)}
    </div>
    <button
      onClick={handleClearCart}
      className="mx-auto w-full max-w-md rounded bg-gray-600 px-6 py-3 font-bold text-white hover:bg-gray-800"
    >
      Clear Cart
    </button>
    <button
      onClick={handleProceedToPayment}
      className="mx-auto w-full max-w-md rounded bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
    >
      PROCEED TO BUY
    </button>
  </div>
);

export default CartPage;
