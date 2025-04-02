import React, { useRef, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useDispatch } from "react-redux";
import { deleteOrder, updateOrderStatus } from "../../redux/orderSlice";
import { toast } from "react-toastify";

const OrdersTable = ({ openModal, orders }) => {
  const tableRef = useRef(null);
  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilterDropdown = () => setShowFilter(!showFilter);

  const handleAvailabilityChange = (e) => setAvailabilityFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDeleteOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );
    if (confirmed) {
      dispatch(deleteOrder(orderId)).then(() => {
        toast.success("Order deleted successfully!");
      });
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order?.customerName
      ?.toLowerCase()
      .includes(searchTerm);

    const matchesAvailability =
      availabilityFilter === "" || order.status === availabilityFilter;
    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="mb-auto flex h-full flex-col gap-4 rounded-md bg-white p-3">
      <div className="flex items-center">
        <h3 className="text-lg text-gray-800">Orders</h3>
        <div className="ml-auto flex gap-2">
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded border bg-blue-600 p-1 px-4 text-sm text-gray-50"
          >
            Add Order
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded border bg-white p-2 px-4 text-sm text-gray-500"
              onClick={toggleFilterDropdown}
            >
              <img
                src="/dashboard/Filter.svg"
                alt="Filter"
                className="aspect-auto h-4"
              />
              Filters
            </button>

            {/* Dropdown Menu */}
            {showFilter && (
              <div className="absolute right-0 mt-2 w-64 rounded border bg-white p-4 shadow-lg">
                {/* Search Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Search by Product
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    placeholder="Search product..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <select
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    value={availabilityFilter}
                    onChange={handleAvailabilityChange}
                  >
                    <option value="">All</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <DownloadTableExcel
            filename="orders-table"
            sheet="orders"
            currentTableRef={tableRef.current}
          >
            <button className="flex items-center gap-2 rounded border p-2 px-4 text-sm text-gray-500">
              Download all
            </button>
          </DownloadTableExcel>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>
        <thead className="">
          <tr>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Order ID
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Customer Name
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Products
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Order Value
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Status
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredOrders.map((order, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {order.orderId}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {order.customerName}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {order.products.map((product, index) =>
                  order.products.length - 1 == index
                    ? product.name + ""
                    : product.name + ", ",
                )}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {order.orderValue.toFixed(2)}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {order.totalQuantity}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.orderId, e.target.value)
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                <button
                  onClick={() => handleDeleteOrder(order.orderId)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
