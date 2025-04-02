import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchUserOrders } from "../../redux/orderSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.userOrders);
  const ordersStatus = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    if (ordersStatus === "idle" && orders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [ordersStatus, orders.length, dispatch]);

  if (ordersStatus === "loading")
    return <StatusMessage message="Loading your orders..." />;
  if (ordersStatus === "failed")
    return <StatusMessage message={`Error: ${error}`} isError />;

  return (
    <div className="orders-page container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <StatusMessage message="You have no orders yet." />
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
};

const StatusMessage = ({ message, isError = false }) => (
  <p className={`text-center text-lg ${isError ? "text-red-500" : ""}`}>
    {message}
  </p>
);

const OrderList = ({ orders }) => (
  <div className="space-y-8">
    {orders.map((order) => (
      <OrderCard key={order.id} order={order} />
    ))}
  </div>
);

const OrderCard = ({ order }) => (
  <div className="flex flex-col items-center justify-between rounded-lg border border-gray-300 bg-white p-6 shadow-md md:flex-row">
    <div className="mb-4 flex-1 md:mb-0">
      <h2 className="mb-2 text-xl font-semibold text-black">
        Order ID: {order.id}
      </h2>
      <OrderDetails order={order} />
    </div>
    <NavLink
      to={`/user/orders/${order.id}`}
      className="mt-4 inline-block rounded bg-black px-6 py-2 font-bold text-white transition-all hover:bg-gray-800 md:mt-0"
    >
      View Details
    </NavLink>
  </div>
);

const OrderDetails = ({ order }) => (
  <>
    <p className="mb-1 text-gray-600">
      <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
    </p>
    <p className="mb-1 text-gray-600">
      <strong>Total Amount:</strong> ${order.order_value.toFixed(2)}
    </p>
    <p className="text-gray-600">
      <strong>Status:</strong> {order.status}
    </p>
  </>
);

export default OrdersPage;
