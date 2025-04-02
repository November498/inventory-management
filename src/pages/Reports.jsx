import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import { fetchProducts } from "../redux/productSlice";
import Loading from "../utils/Loading";
import OrdersChart from "../utils/OrdersChart";
import { Link } from "react-router-dom";

const Reports = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.items || []);
  const orderStatus = useSelector((state) => state.orders.status);

  const products = useSelector((state) => state.products.items || []);
  const productStatus = useSelector((state) => state.products.status);

  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    if (orderStatus === "idle") dispatch(fetchOrders());
    if (productStatus === "idle") dispatch(fetchProducts());
  }, [orderStatus, productStatus, dispatch]);

  useEffect(() => {
    if (orderStatus === "succeeded" && productStatus === "succeeded") {
      setBestSellingProducts(calculateBestSellingProducts(orders, products));
    }
  }, [orders, products, orderStatus, productStatus]);

  if (orderStatus === "loading" || productStatus === "loading") {
    return <Loading />;
  }

  return (
    <div className="overflow-scroll-y flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      <SalesAndPurchaseSection orders={orders} />
      <BestSellingProductsSection bestSellingProducts={bestSellingProducts} />
    </div>
  );
};

const SalesAndPurchaseSection = ({ orders }) => (
  <div className="flex h-1/2 w-full flex-col gap-2 rounded bg-white p-2">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-800">Sales & Purchase</h3>
      <button className="flex items-center gap-2 rounded-sm border p-1 text-sm text-gray-500">
        <img
          src="/dashboard/Calendar.svg"
          alt="Calendar"
          className="aspect-auto h-4"
        />
        Monthly
      </button>
    </div>
    <div className="h-full w-full">
      {orders && <OrdersChart orders={orders} />}
    </div>
  </div>
);

const BestSellingProductsSection = ({ bestSellingProducts }) => (
  <div className="flex h-1/2 w-full flex-col gap-2 rounded bg-white p-2">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-800">Best Selling Products</h3>
      <Link
        to="/dashboard/orders"
        className="text-sm text-blue-500 outline-none"
      >
        See All
      </Link>
    </div>
    <div className="h-full w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {["Product", "Quantity Sold", "Price", "Profit"].map((header) => (
              <th
                key={header}
                scope="col"
                className="py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {bestSellingProducts.map((product, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap py-2 text-xs text-gray-500">
                {product.name}
              </td>
              <td className="whitespace-nowrap py-2 text-xs text-gray-500">
                {product.quantity}
              </td>
              <td className="whitespace-nowrap py-2 text-xs text-gray-500">
                ${product.price.toFixed(2)}
              </td>
              <td className="whitespace-nowrap py-2 text-xs text-gray-500">
                ${product.profit.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const calculateBestSellingProducts = (orders, products) => {
  const productSales = {};

  orders.forEach((order) => {
    if (order.status === "Delivered") {
      order.products.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            quantity: 0,
            price: item.price,
            profit: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        const actualProduct = products.find(
          (product) => product.id === item.productId,
        );
        if (actualProduct) {
          productSales[item.productId].profit +=
            (item.sold - item.price) * item.quantity;
        }
      });
    }
  });

  return Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5); // Top 5 selling products
};

export default Reports;
