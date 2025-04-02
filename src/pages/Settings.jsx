import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/productSlice";
import { addSupplier, fetchSuppliers } from "../redux/supplierSlice";
import Loading from "../utils/Loading";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const bagImages = [
  "https://bagsuz.vercel.app/bags/bag-1.webp",
  "https://bagsuz.vercel.app/bags/bag-2.webp",
  "https://bagsuz.vercel.app/bags/bag-3.webp",
  "https://bagsuz.vercel.app/bags/bag-4.webp",
  "https://bagsuz.vercel.app/bags/crossbody-bag-1.webp",
  "https://bagsuz.vercel.app/bags/crossbody-bag-2.webp",
  "https://bagsuz.vercel.app/bags/crossbody-bag-3.webp",
  "https://bagsuz.vercel.app/bags/crossbody-bag-4.webp",
  "https://bagsuz.vercel.app/bags/handle-bag-1.webp",
  "https://bagsuz.vercel.app/bags/handle-bag-2.webp",
  "https://bagsuz.vercel.app/bags/handle-bag-3.webp",
  "https://bagsuz.vercel.app/bags/handle-bag-4.webp",
  "https://bagsuz.vercel.app/bags/shoulder-bag-1.webp",
  "https://bagsuz.vercel.app/bags/shoulder-bag-2.webp",
  "https://bagsuz.vercel.app/bags/shoulder-bag-3.webp",
  "https://bagsuz.vercel.app/bags/shoulder-bag-4.webp",
  "https://bagsuz.vercel.app/bags/tote-bag-1.webp",
  "https://bagsuz.vercel.app/bags/tote-bag-2.webp",
  "https://bagsuz.vercel.app/bags/tote-bag-3.webp",
  "https://bagsuz.vercel.app/bags/tote-bag-4.webp",
];

const Settings = () => {
  const dispatch = useDispatch();
  const [numProducts, setNumProducts] = useState(1);
  const [numSuppliers, setNumSuppliers] = useState(1);

  const suppliers = useSelector((state) => state.suppliers.items || []);
  const supplierStatus = useSelector((state) => state.suppliers.status);

  useEffect(() => {
    if (supplierStatus === "idle") dispatch(fetchSuppliers());
  }, [supplierStatus, dispatch]);

  const handleGenerateProducts = () => {
    if (suppliers.length === 0) {
      toast.error("Please create a supplier first.");
      return;
    }

    const products = Array.from({ length: numProducts }, () => {
      const randomSupplier =
        suppliers[Math.floor(Math.random() * suppliers.length)];
      const randomImage =
        bagImages[Math.floor(Math.random() * bagImages.length)];
      return {
        name: `Product ${Math.floor(Math.random() * 1000)}`,
        description: `Description for product ${Math.floor(Math.random() * 1000)}`,
        product_image: randomImage,
        category: `Category ${Math.floor(Math.random() * 10)}`,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        quantity: Math.floor(Math.random() * 100),
        threshold: Math.floor(Math.random() * 10),
        supplier_id: randomSupplier.id,
        created_at: new Date().toISOString(),
      };
    });

    products.forEach((product) => dispatch(addProduct(product)));
    toast.success(`${numProducts} products have been successfully created.`);
  };

  const handleGenerateSuppliers = () => {
    const suppliers = Array.from({ length: numSuppliers }, () => ({
      name: `Supplier ${Math.floor(Math.random() * 1000)}`,
      contact_email: `contact${Math.floor(Math.random() * 1000)}@example.com`,
      phone_number: `+1-800-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`,
      address: `Address ${Math.floor(Math.random() * 1000)}`,
    }));

    suppliers.forEach((supplier) => dispatch(addSupplier(supplier)));
    toast.success(`${numSuppliers} suppliers have been successfully created.`);
  };

  if (supplierStatus === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex h-full flex-col gap-4 rounded-md bg-white p-3">
        <div className="grid h-full w-full grid-cols-2 gap-2 divide-gray-500">
          <SettingsSection
            title="Generate Products"
            description="Generate a specified number of random products to populate your inventory with sample data for testing and development."
            buttonLabel="Generate Products"
            buttonColor="bg-blue-500"
            onClick={handleGenerateProducts}
            inputValue={numProducts}
            onInputChange={(e) => setNumProducts(e.target.value)}
            isDisabled={suppliers.length === 0}
          />
          <SettingsSection
            title="Generate Suppliers"
            description="Generate a specified number of random suppliers to populate your supplier list with sample data for testing and development."
            buttonLabel="Generate Suppliers"
            buttonColor="bg-green-500"
            onClick={handleGenerateSuppliers}
            inputValue={numSuppliers}
            onInputChange={(e) => setNumSuppliers(e.target.value)}
          />
          <div className="h-full w-full bg-gray-100">
            <div className="flex w-full flex-col gap-4 rounded-md border p-4">
              <Link
                to="/user"
                className="h-fit w-full rounded-md bg-blue-500 px-4 py-2 text-gray-50"
              >
                Go to User Side
              </Link>
              <p className="text-sm italic text-gray-600">
                Go to the user side of the project to view and manage orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsSection = ({
  title,
  description,
  buttonLabel,
  buttonColor,
  onClick,
  inputValue,
  onInputChange,
  isDisabled = false,
}) => (
  <div className="flex w-full flex-col gap-4 rounded-md border p-4">
    <h3 className="text-lg">{title}</h3>
    <div className="flex h-fit w-full gap-2">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`h-fit w-full rounded-md ${buttonColor} px-4 py-2 text-gray-50`}
      >
        {buttonLabel}
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={onInputChange}
        className="w-fit rounded border text-center"
        min="1"
      />
    </div>
    <p className="text-sm italic text-gray-600">{description}</p>
  </div>
);

export default Settings;
