import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Link } from "react-router-dom";
import { deleteProduct } from "../../redux/productSlice";
import { toast } from "react-toastify";

const InventoryTable = ({ products, openModal }) => {
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const [showFilter, setShowFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilterDropdown = () => setShowFilter(!showFilter);
  const handleAvailabilityChange = (e) => setAvailabilityFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDeleteProduct = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (confirmed) {
      dispatch(deleteProduct(productId)).then(() => {
        toast.success("Product deleted successfully!");
      });
    }
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm);
    const matchesAvailability =
      availabilityFilter === "" ||
      (availabilityFilter === "In Stock" &&
        product.quantity > product.threshold) ||
      (availabilityFilter === "Low Stock" &&
        product.quantity <= product.threshold &&
        product.quantity > 0) ||
      (availabilityFilter === "Out of Stock" && product.quantity === 0);
    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="mb-auto flex h-full flex-col gap-4 overflow-scroll rounded-md bg-white p-3">
      <div className="flex items-center">
        <h3 className="text-lg text-gray-800">Products</h3>
        <div className="ml-auto flex gap-2">
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded border bg-blue-600 p-1 px-4 text-sm text-gray-50"
          >
            Add Product
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
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <DownloadTableExcel
            filename="inventory-table"
            sheet="inventory"
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
              Product
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Buying Price
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
              Threshold Value
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Availability
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
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600 hover:text-blue-500">
                <Link to={`${product.id}`}>{product.name}</Link>
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {product.price}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {product.quantity}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {product.threshold}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {product.quantity > 0 ? (
                  product.quantity <= product.threshold ? (
                    <span className="text-red-500">Low stock</span>
                  ) : (
                    <span className="text-green-600">In stock</span>
                  )
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
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

export default InventoryTable;
