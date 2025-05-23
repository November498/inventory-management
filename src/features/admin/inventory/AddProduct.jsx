import React, { useEffect, useState } from "react";
import ModalForm from "../../../layouts/Modal";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../utils/Loading";
import { fetchSuppliers } from "../../../redux/supplierSlice";
import { addProduct } from "../../../redux/productSlice";
import { toast } from "react-toastify";

const AddProduct = ({ isModalOpen, openModal, closeModal }) => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.suppliers.items || []);
  const supplierStatus = useSelector((state) => state.suppliers.status);

  const [productImage, setProductImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const [description, setDescription] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (supplierStatus === "idle") dispatch(fetchSuppliers());
  }, [supplierStatus, dispatch]);

  useEffect(() => {
    setProductImage("https://via.placeholder.com/150");
    setProductName("Sample Product");
    setCategory("tote_bag");
    setBuyingPrice("100");
    setQuantity("10");
    setThresholdValue("5");
    setDescription("This is a sample product description.");
    setSupplierId(0);
  }, []);

  const validateFields = () => {
    const errors = {};
    if (!productImage) errors["Image URL"] = "Image URL is required";
    if (!productName) errors["Product Name"] = "Product Name is required";
    if (!category) errors["Category"] = "Category is required";
    if (!buyingPrice || buyingPrice <= 0)
      errors["Buying Price"] = "Buying Price must be greater than 0";
    if (!quantity || quantity <= 0)
      errors["Quantity"] = "Quantity must be greater than 0";
    if (!thresholdValue || thresholdValue <= 0)
      errors["Threshold Value"] = "Threshold Value must be greater than 0";
    if (!description) errors["Description"] = "Description is required";
    if (!supplierId) errors["Supplier"] = "Supplier is required";
    return errors;
  };

  const handleFieldChange = (field, value) => {
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const formFields = [
    {
      label: "Image URL",
      type: "text",
      placeholder: "Enter image url",
      value: productImage,
      onChange: (e) => {
        setProductImage(e.target.value);
        handleFieldChange("Image URL", e.target.value);
      },
      errorMessage: validationErrors["Image URL"],
    },
    {
      label: "Description",
      type: "textarea",
      placeholder: "Write description",
      value: description,
      onChange: (e) => {
        setDescription(e.target.value);
        handleFieldChange("Description", e.target.value);
      },
      errorMessage: validationErrors["Description"],
    },
    {
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      value: productName,
      onChange: (e) => {
        setProductName(e.target.value);
        handleFieldChange("Product Name", e.target.value);
      },
      errorMessage: validationErrors["Product Name"],
    },
    {
      label: "Category",
      type: "select",
      value: category,
      onChange: (e) => {
        setCategory(e.target.value);
        handleFieldChange("Category", e.target.value);
      },
      options: [
        { label: "Select category", value: "" },
        { label: "Tote bag", value: "tote_bag" },
        { label: "Crossbody bag", value: "crossbody_bag" },
        { label: "Handle bag", value: "handle_bag" },
        { label: "Shoulder bag", value: "shoulder_bag" },
      ],
      errorMessage: validationErrors["Category"],
    },
    {
      label: "Supplier",
      type: "select",
      value: supplierId,
      onChange: (e) => {
        setSupplierId(e.target.value);
        handleFieldChange("Supplier", e.target.value);
      },
      options: [
        { label: "Select supplier", value: "" },
        ...suppliers.map((supplier) => ({
          label: supplier.name,
          value: supplier.id,
        })),
      ],
      errorMessage: validationErrors["Supplier"],
    },
    {
      label: "Buying Price",
      type: "number",
      placeholder: "Enter buying price",
      value: buyingPrice,
      onChange: (e) => {
        setBuyingPrice(e.target.value);
        handleFieldChange("Buying Price", e.target.value);
      },
      errorMessage: validationErrors["Buying Price"],
    },
    {
      label: "Quantity",
      type: "number",
      placeholder: "Enter quantity",
      value: quantity,
      onChange: (e) => {
        setQuantity(e.target.value);
        handleFieldChange("Quantity", e.target.value);
      },
      errorMessage: validationErrors["Quantity"],
    },
    {
      label: "Threshold Value",
      type: "number",
      placeholder: "Enter threshold value",
      value: thresholdValue,
      onChange: (e) => {
        setThresholdValue(e.target.value);
        handleFieldChange("Threshold Value", e.target.value);
      },
      errorMessage: validationErrors["Threshold Value"],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    dispatch(
      addProduct({
        name: productName,
        product_image: productImage,
        price: buyingPrice,
        quantity: quantity,
        threshold: thresholdValue,
        supplier_id: supplierId,
        description: description,
        category: category,
      }),
    )
      .then(() => {
        toast.success("New Product Added!");
        closeModal();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  if (supplierStatus === "loading") {
    return <Loading />;
  }

  return (
    <ModalForm
      isOpen={isModalOpen}
      onClose={closeModal}
      title="New Product"
      formFields={formFields}
      onSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};

export default AddProduct;
