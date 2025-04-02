import React from "react";
import Chart from "../../utils/Chart";

const SalesAndPurchase = ({ products = [], orders = [] }) => {
  const currentYear = new Date().getFullYear();

  // Initialize arrays with 12 months of zeros
  const monthlyPurchasesArray = Array(12).fill(0);
  const monthlySalesArray = Array(12).fill(0);

  // Populate monthlyPurchasesArray
  products.forEach((product) => {
    if (product.created_at) {
      const date = new Date(product.created_at);
      const month = date.getMonth(); // 0 = January, 11 = December
      const year = date.getFullYear();

      if (year === currentYear) {
        monthlyPurchasesArray[month] += product.price * product.quantity;
      }
    }
  });

  // Populate monthlySalesArray
  orders.forEach((order) => {
    if (order.created_at) {
      const date = new Date(order.created_at);
      const month = date.getMonth(); // 0 = January, 11 = December
      const year = date.getFullYear();

      if (year === currentYear) {
        monthlySalesArray[month] += order.orderValue;
      }
    }
  });

  return (
    <div className="flex h-72 w-full flex-col rounded-md bg-white p-2 px-3">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800">Sales & Purchase</h3>
        <button className="flex items-center gap-4 rounded-sm border p-1 px-2 text-sm text-gray-500">
          <img
            src="/dashboard/Calendar.svg"
            alt="Calendar"
            className="aspect-auto h-4"
          />
          Monthly
        </button>
      </div>

      <div className="flex h-full items-center justify-center">
        {monthlyPurchasesArray.length > 0 || monthlySalesArray.length > 0 ? (
          <Chart
            monthlyPurchases={monthlyPurchasesArray}
            monthlySales={monthlySalesArray}
          />
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};

export default SalesAndPurchase;
