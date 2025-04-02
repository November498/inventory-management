import React from "react";
import { Link } from "react-router-dom";

const LowQuantityStock = ({ lowQuantityProducts }) => {
  return (
    <div className="flex h-72 w-full flex-col rounded-md bg-white p-2 px-3">
      <div className="flex items-center justify-between px-3 py-4">
        <h3 className="text-gray-800">Low Quantity Stock</h3>
        <Link
          to="/dashboard/inventory"
          className="text-sm text-blue-500 outline-none"
        >
          See All
        </Link>
      </div>

      <ul className="divide-y divide-gray-200">
        {lowQuantityProducts?.map((product, index) => (
          <li key={index}>
            <Link
              to={`/dashboard/inventory/${product.id}`}
              className="flex items-center justify-between p-4 transition-all hover:bg-gray-200"
            >
              <img
                src={product.product_image}
                alt="Product 1"
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {product.name}
                </span>
                <span className="text-xs text-gray-500">
                  Remaining Quantity: {product.quantity}
                </span>
              </div>
              <span className="rounded-full bg-orange-200 px-3 py-1 text-xs text-red-500">
                Low
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowQuantityStock;
