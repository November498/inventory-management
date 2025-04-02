import React, { useEffect, useState } from "react";
import { supabase } from "../../redux/supabaseClient";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../../redux/orderSlice";
import { Link } from "react-router-dom";
import sendLowStockEmail from "./sendLowStockEmail";

const OrderNotifications = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    // Subscribe to new orders
    const orderChannel = supabase
      .channel("new_orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setNotifications((prev) => [
            ...prev,
            {
              message: `🛒 New Order: #${payload.new.id} - ${payload.new.customer_name}`,
              type: "order",
              link: "/dashboard/orders",
            },
          ]);
          setDropdownVisible(true);
          dispatch(fetchOrders());
        },
      )
      .subscribe();

    const productChannel = supabase
      .channel("low_stock_alerts")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        async (payload) => {
          if (payload.new.quantity <= payload.new.threshold) {
            // Add notification to the list
            setNotifications((prev) => [
              ...prev,
              {
                message: `⚠️ Low Stock: ${payload.new.name} - Only ${payload.new.quantity} left!`,
                type: "low-stock",
                link: `/dashboard/inventory/${payload.new.id}`,
              },
            ]);
            setDropdownVisible(true);

            // Get supplier email from the database
            const { data: supplier } = await supabase
              .from("suppliers")
              .select("contact_email")
              .eq("id", payload.new.supplier_id)
              .single();

            // Send the email notification
            if (supplier) {
              await sendLowStockEmail(
                payload.new.contact_email || import.meta.env.VITE_TEST_EMAIL,
                payload.new.name,
                payload.new.quantity,
              );
            }
          }
        },
      )
      .subscribe();

    // Cleanup subscriptions on component unmount
    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(productChannel);
    };
  }, [dispatch]);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <div
        className="relative flex cursor-pointer items-center p-2 hover:opacity-80"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <img src="/bell.svg" className="h-6 w-6" alt="Notification" />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Dropdown Notifications */}
      {dropdownVisible && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-gray-300">
          <ul className="max-h-80 divide-y overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 p-3 text-sm ${
                    notification.type === "low-stock"
                      ? "bg-red-50 text-red-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">
                    {notification.type === "low-stock" ? "⚠️" : "🛒"}
                  </span>
                  {notification.link ? (
                    <Link to={notification.link} className="hover:underline">
                      {notification.message}
                    </Link>
                  ) : (
                    notification.message
                  )}
                </li>
              ))
            ) : (
              <li className="p-3 text-center text-gray-500">
                No notifications
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderNotifications;
