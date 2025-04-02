import React from "react";

const InventorySummary = ({ inventoryTotalQuantity, onTheWay }) => {
  return (
    <div className="flex h-32 w-full flex-col justify-between rounded-md bg-white p-2 px-3">
      <h3 className="text-gray-800">Inventory Summary</h3>
      <div className="flex justify-between">
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <img src="/dashboard/Quantity.svg" alt="" className="aspect-square" />
          <span className="text-sm font-bold">{inventoryTotalQuantity}</span>
          <span className="text-xs">Quantity</span>
        </div>
        <span className="h-full w-1 bg-slate-100"></span>
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <img src="/dashboard/Ontheway.svg" alt="" className="aspect-square" />
          <span className="text-sm font-bold">{onTheWay}</span>
          <span className="text-xs">On the way</span>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
