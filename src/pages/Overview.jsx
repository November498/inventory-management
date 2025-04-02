import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import { fetchProducts } from "../redux/productSlice";
import { fetchSuppliersCount } from "../redux/supplierSlice";

import Loading from "../utils/Loading";

import TopSellings from "../components/overview/TopSellings";
import SalesOverview from "../components/overview/SalesOverview";
import OrdersOverview from "../components/overview/OrdersOverview";
import ProductOverview from "../components/overview/ProductOverview";
import PurchaseOverview from "../components/overview/PurchaseOverview";
import SalesAndPurchase from "../components/overview/SalesAndPurchase";
import InventorySummary from "../components/overview/InventorySummary";
import LowQuantityStock from "../components/overview/LowQuantityStock";

const Overview = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items || []);
  const productStatus = useSelector((state) => state.products.status);
  const orders = useSelector((state) => state.orders.items || []);
  const orderStatus = useSelector((state) => state.orders.status);

  const [metrics, setMetrics] = useState({
    inventoryTotalQuantity: 0,
    suppliersCount: 0,
    lowQuantityProducts: [],
    canceledOrdersCount: 0,
    deliveredOrdersCount: 0,
    shippedOrdersCount: 0,
    onTheWay: 0,
    revenue: 0,
    sales: 0,
    profit: 0,
    topSellings: [],
  });

  const calculateMetrics = () => {
    const inventoryMetrics = calculateInventoryMetrics(products);
    const orderMetrics = calculateOrderMetrics(orders);
    const revenue = calculateRevenue(orders);
    const sales = calculateSales(orders);
    const profit = calculateProfit(orders);
    const topSellings = calculateTopSellings(orders);

    setMetrics({
      ...inventoryMetrics,
      ...orderMetrics,
      revenue,
      sales,
      profit,
      topSellings,
    });
  };

  useEffect(() => {
    if (productStatus === "idle") dispatch(fetchProducts());
    if (orderStatus === "idle") dispatch(fetchOrders());
  }, [productStatus, orderStatus, dispatch]);

  useEffect(() => {
    if (productStatus === "succeeded" && orderStatus === "succeeded") {
      calculateMetrics();
    }
  }, [products, orders, productStatus, orderStatus]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const count = await fetchSuppliersCount();
        setMetrics((prev) => ({ ...prev, suppliersCount: count }));
      } catch (error) {
        console.error("Failed to fetch suppliers count:", error);
      }
    };

    fetchSuppliers();
  }, []);

  if (productStatus === "loading" || orderStatus === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex h-fit flex-row gap-4 p-4">
      <div className="flex h-full w-[60%] flex-col gap-4">
        <SalesOverview
          revenue={metrics.revenue}
          sales={metrics.sales}
          profit={metrics.profit}
        />
        <PurchaseOverview
          deliveredOrdersCount={metrics.deliveredOrdersCount}
          shippedOrdersCount={metrics.shippedOrdersCount}
          canceledOrdersCount={metrics.canceledOrdersCount}
        />
        {orders && products && (
          <SalesAndPurchase orders={orders} products={products} />
        )}
        <TopSellings topSellings={metrics.topSellings} />
      </div>
      <div className="flex h-full w-[40%] flex-col gap-4">
        <InventorySummary
          inventoryTotalQuantity={metrics.inventoryTotalQuantity}
          onTheWay={metrics.onTheWay}
        />
        <ProductOverview suppliersCount={metrics.suppliersCount} />
        {orders && <OrdersOverview orders={orders} />}
        <LowQuantityStock lowQuantityProducts={metrics.lowQuantityProducts} />
      </div>
    </div>
  );
};

// Helper Functions
const calculateInventoryMetrics = (products) => {
  let totalQuantity = 0;
  const lowQuantityProducts = [];

  products.forEach((product) => {
    totalQuantity += product.quantity;
    if (product.quantity < 10) {
      lowQuantityProducts.push(product);
    }
  });

  return {
    inventoryTotalQuantity: totalQuantity,
    lowQuantityProducts,
  };
};

const calculateOrderMetrics = (orders) => {
  const canceledOrders = orders.filter((order) => order.status === "Canceled");
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  );
  const shippedOrders = orders.filter((order) => order.status === "Shipped");
  const onTheWayOrders = orders.filter(
    (order) => order.status === "Shipped" || order.status === "Pending",
  );

  return {
    canceledOrdersCount: canceledOrders.length,
    deliveredOrdersCount: deliveredOrders.length,
    shippedOrdersCount: shippedOrders.length,
    onTheWay: onTheWayOrders.length,
  };
};

const calculateRevenue = (orders) =>
  orders.reduce(
    (total, order) =>
      order.status === "Delivered" ? total + order.orderValue : total,
    0,
  );

const calculateSales = (orders) =>
  orders.reduce(
    (total, order) =>
      order.status === "Delivered"
        ? total + order.products.reduce((sum, item) => sum + item.quantity, 0)
        : total,
    0,
  );

const calculateProfit = (orders) =>
  orders.reduce(
    (total, order) =>
      order.status === "Delivered"
        ? total +
          order.products.reduce(
            (sum, item) => sum + (item.sold - item.price) * item.quantity,
            0,
          )
        : total,
    0,
  );

const calculateTopSellings = (orders) => {
  const productSales = {};

  orders.forEach((order) => {
    if (order.status === "Delivered") {
      order.products.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name, quantity: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
      });
    }
  });

  return Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
};

export default Overview;
