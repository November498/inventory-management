import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../utils/Loading";
import InventoryTable from "../components/tables/InventoryTable";
import AddProduct from "../features/admin/inventory/AddProduct";
import { fetchProducts } from "../redux/productSlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items || []);
  const productStatus = useSelector((state) => state.products.status);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (productStatus === "idle") dispatch(fetchProducts());
  }, [productStatus, dispatch]);

  if (productStatus === "loading") return <Loading />;

  const inventoryMetrics = calculateInventoryMetrics(products);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <InventoryOverview metrics={inventoryMetrics} />
      <InventoryTable
        products={products}
        openModal={() => setIsModalOpen(true)}
      />
      <AddProduct
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const InventoryOverview = ({ metrics }) => (
  <div className="flex h-fit flex-col gap-4 rounded-md bg-white p-3">
    <h3 className="text-lg text-gray-800">Overall Inventory</h3>
    <div className="flex h-full w-full divide-x divide-gray-200">
      {[
        { label: "Categories", value: 4, color: "text-blue-500" },
        {
          label: "Total Products",
          value: metrics.totalProducts,
          color: "text-green-500",
        },
        {
          label: "Out of Stocks",
          value: metrics.outOfStocks,
          color: "text-blue-600",
        },
        {
          label: "Low Stocks",
          value: metrics.lowStocks,
          color: "text-red-500",
        },
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
      <p className="text-sm font-light text-gray-500">Last 7 days</p>
    </div>
  </div>
);

const calculateInventoryMetrics = (products) => {
  const totalProducts = products.length;
  const lowStocks = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.threshold,
  ).length;
  const outOfStocks = products.filter(
    (product) => product.quantity === 0,
  ).length;

  return { totalProducts, lowStocks, outOfStocks };
};

export default Inventory;
