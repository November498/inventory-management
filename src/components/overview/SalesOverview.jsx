import React from "react";

const SalesOverview = ({ revenue, sales, profit }) => {
  return (
    <div className="flex h-32 w-full flex-col rounded-md bg-white p-2 px-3">
      <h3 className="text-gray-800">Sales Overview</h3>
      <div className="flex h-full w-full items-center justify-around">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <img src="/dashboard/Sales.svg" alt="svg" className="aspect-square" />
          <div className="flex w-full items-center justify-center gap-10">
            <span className="text-sm font-bold text-gray-500">
              {sales.toFixed(2)}
            </span>
            <p className="text-sm font-light text-gray-500">Sales</p>
          </div>
        </div>
        <span className="h-4/5 w-1 bg-gray-200"></span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <img
            src="/dashboard/Revenue.svg"
            alt="svg"
            className="aspect-square"
          />
          <div className="flex w-full items-center justify-center gap-10">
            <span className="text-sm font-bold text-gray-500">${revenue.toFixed(2)}</span>
            <p className="text-sm font-light text-gray-500">Revenue</p>
          </div>
        </div>
        <span className="h-4/5 w-1 bg-gray-200"></span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <img
            src="/dashboard/Profit.svg"
            alt="svg"
            className="aspect-square"
          />
          <div className="flex w-full items-center justify-center gap-10">
            <span className="text-sm font-bold text-gray-500">${profit.toFixed(2)}</span>
            <p className="text-sm font-light text-gray-500">Profit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
