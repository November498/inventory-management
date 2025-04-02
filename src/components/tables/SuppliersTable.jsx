import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DownloadTableExcel } from "react-export-table-to-excel";
import EditSupplier from "../../features/admin/suppliers/EditSupplier";
import { deleteSupplier } from "../../redux/supplierSlice";
import { toast } from "react-toastify";

const SuppliersTable = ({ openModal, suppliers }) => {
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const [showFilter, setShowFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  const toggleFilterDropdown = () => setShowFilter(!showFilter);

  const handleAvailabilityChange = (e) => setAvailabilityFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDeleteSupplier = (supplierId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?",
    );
    if (confirmed) {
      dispatch(deleteSupplier(supplierId)).then(() => {
        toast.success("Supplier deleted successfully!");
      });
    }
  };

  const handleEditSupplier = (supplierId) => {
    setSelectedSupplierId(supplierId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSupplierId(null);
  };

  const filteredSuppliers = suppliers?.filter((supplier) => {
    const matchesSearch = supplier?.name?.toLowerCase().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="flex h-full flex-col gap-4 overflow-scroll rounded-md bg-white p-3">
      <div className="flex items-center">
        <h3 className="text-lg text-gray-800">Suppliers</h3>
        <div className="ml-auto flex gap-2">
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded border bg-blue-600 p-1 px-4 text-sm text-gray-50"
          >
            Add Supplier
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
                    Search by Supplier
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    placeholder="Search supplier..."
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
                  </select>
                </div>
              </div>
            )}
          </div>
          <DownloadTableExcel
            filename="suppliers-table"
            sheet="suppliers"
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
              Supplier Name
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Address
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Phone Number
            </th>
            <th
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-wider text-gray-500"
            >
              Email
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
          {filteredSuppliers.map((supplier, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {supplier.name}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {supplier.address}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {supplier.phone_number}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                {supplier.contact_email}
              </td>
              <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditSupplier(supplier.id)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Supplier Modal */}
      {selectedSupplierId && (
        <EditSupplier
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
          supplierId={selectedSupplierId}
        />
      )}
    </div>
  );
};

export default SuppliersTable;
