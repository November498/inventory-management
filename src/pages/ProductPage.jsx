import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import EditProduct from "../features/admin/inventory/EditProduct";
import { fetchProduct } from "../redux/productSlice";
import { fetchSupplier } from "../redux/supplierSlice";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) =>
    state.products.items.find((p) => p.id == id),
  );
  const productStatus = useSelector((state) => state.products.status);
  const supplier = useSelector((state) =>
    state.suppliers.items.find((s) => s.id === product?.supplier_id),
  );
  const supplierStatus = useSelector((state) => state.suppliers.status);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.supplier_id) dispatch(fetchSupplier(product.supplier_id));
  }, [dispatch, product?.supplier_id]);

  const handleEditProduct = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const handleGoBack = () => navigate(-1);

  if (productStatus === "loading" || supplierStatus === "loading") {
    return <Loading />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-full w-full rounded bg-white p-4">
        <Header
          product={product}
          onGoBack={handleGoBack}
          onEditProduct={handleEditProduct}
        />
        <MainContent product={product} supplier={supplier} />
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <EditProduct
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
          productId={product.id}
        />
      )}
    </div>
  );
};

const Header = ({ product, onGoBack, onEditProduct }) => (
  <div className="flex w-full justify-between">
    <button
      onClick={onGoBack}
      className="mr-auto flex h-fit items-center gap-2 rounded border p-1 px-2 text-sm text-gray-500"
    >
      Go Back
    </button>
    <h2 className="mr-auto text-lg">{product.name}</h2>
    <button
      onClick={onEditProduct}
      className="ml-4 flex h-fit items-center gap-2 rounded border p-1 px-2 text-sm text-gray-500"
    >
      <img src="/dashboard/Edit.svg" alt="Edit" className="aspect-auto h-4" />
      Edit
    </button>
    <button className="flex h-fit items-center gap-4 rounded border p-1 px-2 text-sm text-gray-500">
      Download
    </button>
  </div>
);

const MainContent = ({ product, supplier }) => (
  <div className="flex h-full w-full flex-col divide-y divide-gray-200 pt-12">
    <Tabs />
    <div className="flex h-full w-full p-4">
      <ProductDetails product={product} supplier={supplier} />
      <ProductImageAndStock product={product} />
    </div>
  </div>
);

const Tabs = () => (
  <div className="flex h-fit w-full gap-12">
    <button className="border-blue-500 pb-3 pr-1 text-sm text-gray-500 hover:border-b hover:text-blue-500">
      Overview
    </button>
  </div>
);

const ProductDetails = ({ product, supplier }) => (
  <div className="h-full w-2/3">
    <Section title="Product Details">
      <Detail label="Product Name" value={product.name} />
      <Detail label="Product ID" value={product.id} />
      <Detail label="Product Category" value={product.category} />
      <Detail label="Threshold value" value={product.threshold} />
    </Section>
    <Section title="Supplier Details">
      <Detail label="Supplier Name" value={supplier?.name} />
      <Detail label="Contact Number" value={supplier?.phone_number} />
      <Detail label="Address" value={supplier?.address} />
    </Section>
  </div>
);

const ProductImageAndStock = ({ product }) => (
  <div className="flex h-full w-1/3 flex-col items-center gap-12">
    <div className="h-1/3 w-full">
      <img
        src={product.product_image}
        alt={product.name}
        className="h-full w-full object-contain"
      />
    </div>
    <Section>
      <Detail label="Remaining Stocks" value={product.quantity} />
      <Detail label="Threshold value" value={product.threshold} />
    </Section>
  </div>
);

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-8">
    {title && <h3 className="text-md py-6 font-medium">{title}</h3>}
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-gray-600">{value}</p>
  </div>
);

export default ProductPage;
