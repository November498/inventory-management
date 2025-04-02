import React from "react";

const PurchaseOverview = ({
  deliveredOrdersCount,
  shippedOrdersCount,
  canceledOrdersCount,
}) => {
  return (
    <div className="flex h-32 w-full flex-col rounded-md bg-white p-2 px-3">
      <h3 className="text-gray-800">Purchase Overview</h3>
      <div className="flex h-full w-full items-center justify-around">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <img
            src="/dashboard/Purchase.svg"
            alt="svg"
            className="aspect-square"
          />
          <div className="flex w-full items-center justify-center gap-10">
            <span className="text-sm font-bold text-gray-500">
              {deliveredOrdersCount}
            </span>
            <p className="text-sm font-light text-gray-500">Delivered</p>
          </div>
        </div>
        <span className="h-4/5 w-1 bg-gray-200"></span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <img src="/dashboard/Cost.svg" alt="svg" className="aspect-square" />
          <div className="flex w-full items-center justify-center gap-10">
            <span className="text-sm font-bold text-gray-500">
              {shippedOrdersCount}
            </span>
            <p className="text-sm font-light text-gray-500">Shipped</p>
          </div>
        </div>
        <span className="h-4/5 w-1 bg-gray-200"></span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <img
            src="/dashboard/Cancel.svg"
            alt="svg"
            className="aspect-square"
          />
          <div className="flex w-full items-center justify-center gap-10">
            <span className="text-sm font-bold text-gray-500">
              {canceledOrdersCount}
            </span>
            <p className="text-sm font-light text-gray-500">Canceled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOverview;
