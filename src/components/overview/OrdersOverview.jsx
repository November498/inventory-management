import React, { useEffect, useState } from "react";
import OrdersChart from "../../utils/OrdersChart";

const OrdersOverview = ({ orders }) => {
  return (
    <div className="flex h-72 w-full flex-col rounded-md bg-white p-2 px-3">
      <h3 className="text-gray-800">Order Overview</h3>
      <div className="h-full w-full">
        <OrdersChart orders={orders} />
      </div>
    </div>
  );
};

export default OrdersOverview;
