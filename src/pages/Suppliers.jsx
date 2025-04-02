import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "../redux/supplierSlice";
import Loading from "../utils/Loading";
import SuppliersTable from "../components/tables/SuppliersTable";
import AddSupplier from "../features/admin/suppliers/AddSupplier";

const Suppliers = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.suppliers.items || []);
  const supplierStatus = useSelector((state) => state.suppliers.status);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (supplierStatus === "idle") {
      dispatch(fetchSuppliers());
    }
  }, [supplierStatus, dispatch]);

  if (supplierStatus === "loading") {
    return <Loading />;
  }

  return (
    <div className="h-full w-full p-4">
      <SuppliersTable
        suppliers={suppliers}
        openModal={() => setIsModalOpen(true)}
      />
      <AddSupplier
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Suppliers;
