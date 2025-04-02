import React from "react";
import { Link } from "react-router-dom";

const TopSellings = ({ topSellings }) => {
  return (
    <div className="flex h-72 w-full flex-col rounded-md bg-white p-2 px-3">
      <div className="flex items-center justify-between px-3 py-4">
        <h3 className="text-gray-800">Top Selling Products</h3>
        <Link to="/dashboard/orders" className="text-sm text-blue-500 outline-none">
          See All
        </Link>
      </div>

      <div className="h-full w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className=" border-t border-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Sold Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {topSellings.map((product, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500">
                  {product.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellings;