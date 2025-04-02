import React from "react";

const ProductOverview = ({ suppliersCount }) => {
  return (
    <div className="flex h-32 w-full flex-col justify-between rounded-md bg-white p-2 px-3">
      <h3 className="text-gray-800">Product Overview</h3>
      <div className="flex justify-between">
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <img
            src="/dashboard/Suppliers.svg"
            alt=""
            className="aspect-square"
          />
          <span className="text-sm font-bold">{suppliersCount}</span>
          <span className="text-xs">Suppliers</span>
        </div>
        <span className="h-full w-1 bg-slate-100"></span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <img
            src="/dashboard/Categories.svg"
            alt=""
            className="aspect-square"
          />
          <span className="text-sm font-bold">4</span>
          <span className="text-xs">Number of categories</span>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
