import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../features/cart/cartSlice";
import { addOrder, fetchUserOrders } from "../../redux/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [processing, setProcessing] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handlePayment = () => {
    if (!userInfo) {
      alert("Please log in to proceed with the payment.");
      navigate("/login");
      return;
    }

    setProcessing(true);
    const order = createOrder(userInfo, cartItems, totalAmount);

    dispatch(addOrder(order)).then(() => {
      dispatch(clearCart());
      alert("Payment successful! Thank you for your purchase.");
      dispatch(fetchUserOrders());
      navigate("/user/orders");
    });
  };

  if (!userInfo) {
    return (
      <StatusMessage message="Please login to proceed with the payment." />
    );
  }

  return (
    <div className="payment-page container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Payment Processing
      </h1>
      <OrderSummary cartItems={cartItems} totalAmount={totalAmount} />
      <PaymentButton processing={processing} handlePayment={handlePayment} />
    </div>
  );
};

const createOrder = (userInfo, cartItems, totalAmount) => ({
  customerName: userInfo?.user_metadata?.username,
  userId: userInfo?.id,
  products: cartItems.map((item) => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    price: calculateSellingPrice(item.price),
  })),
  status: "Pending",
  orderValue: totalAmount,
});

const calculateSellingPrice = (price) => price + price * 0.1; // Adding 10% to the base price

const StatusMessage = ({ message }) => (
  <div className="text-center">
    <p className="text-lg">{message}</p>
  </div>
);

const OrderSummary = ({ cartItems, totalAmount }) => (
  <div className="mb-6 rounded-lg bg-gray-100 p-6">
    <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
    <ul className="mb-4">
      {cartItems.map((item) => (
        <li key={item.id} className="flex justify-between border-b py-2">
          <span>{item.name}</span>
          <span>
            ${item.price} x {item.quantity}
          </span>
        </li>
      ))}
    </ul>
    <div className="text-right text-xl font-bold">
      Total Amount: ${totalAmount.toFixed(2)}
    </div>
  </div>
);

const PaymentButton = ({ processing, handlePayment }) => (
  <div className="flex justify-center">
    <button
      onClick={handlePayment}
      disabled={processing}
      className={`w-full max-w-xs rounded px-6 py-3 text-lg font-bold text-white ${
        processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {processing ? "Processing..." : "Pay Now"}
    </button>
  </div>
);

export default PaymentPage;
