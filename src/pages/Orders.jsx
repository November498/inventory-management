import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddOrder from "../features/admin/orders/AddOrder";
import Loading from "../utils/Loading";
import OrdersTable from "../components/tables/OrdersTable";
import { fetchOrders } from "../redux/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.items || []);
  const orderStatus = useSelector((state) => state.orders.status);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderMetrics, setOrderMetrics] = useState({
    totalOrders: 0,
    totalDelivered: 0,
    totalCanceled: 0,
    onTheWay: 0,
  });

  useEffect(() => {
    if (orderStatus === "idle") dispatch(fetchOrders());
  }, [orderStatus, dispatch]);

  useEffect(() => {
    if (orderStatus === "succeeded") {
      setOrderMetrics(calculateOrderMetrics(orders));
    }
  }, [orders, orderStatus]);

  if (orderStatus === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <OrderOverview metrics={orderMetrics} />
      <OrdersTable openModal={() => setIsModalOpen(true)} orders={orders} />
      <AddOrder
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const OrderOverview = ({ metrics }) => (
  <div className="flex h-fit flex-col gap-4 rounded-md bg-white p-3">
    <h3 className="text-lg text-gray-800">Overall Orders</h3>
    <div className="flex h-full w-full divide-x divide-gray-200">
      {[
        {
          label: "Total Orders",
          value: metrics.totalOrders,
          color: "text-blue-500",
        },
        {
          label: "Total Delivered",
          value: metrics.totalDelivered,
          color: "text-green-500",
        },
        {
          label: "Total Canceled",
          value: metrics.totalCanceled,
          color: "text-blue-600",
        },
        { label: "On the Way", value: metrics.onTheWay, color: "text-red-500" },
      ].map((item, index) => (
        <OverviewItem
          key={index}
          label={item.label}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  </div>
);

const OverviewItem = ({ label, value, color }) => (
  <div className="flex h-full w-full flex-col gap-2 px-4">
    <h3 className={`text-sm font-semibold ${color}`}>{label}</h3>
    <div className="mt-auto flex flex-col gap-4">
      <p className="text-sm font-semibold text-gray-500">{value}</p>
      <p className="text-xs text-gray-500">Last 7 days</p>
    </div>
  </div>
);

const calculateOrderMetrics = (orders) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    return orderDate >= sevenDaysAgo;
  });

  const totalOrders = filteredOrders.length;
  const totalDelivered = filteredOrders.filter(
    (order) => order.status === "Delivered",
  ).length;
  const totalCanceled = filteredOrders.filter(
    (order) => order.status === "Canceled",
  ).length;
  const onTheWay = filteredOrders.filter(
    (order) => order.status === "Pending" || order.status === "Shipped",
  ).length;

  return { totalOrders, totalDelivered, totalCanceled, onTheWay };
};

export default Orders;
