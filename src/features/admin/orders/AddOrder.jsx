import React, { useEffect, useState } from "react";
import ModalForm from "../../../layouts/Modal";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../utils/Loading";
import { fetchProducts } from "../../../redux/productSlice";
import { fetchAllUsers } from "../../auth/userSlice";
import { addOrder } from "../../../redux/orderSlice";
import { toast } from "react-toastify";

const AddOrder = ({ isModalOpen, closeModal }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const products = useSelector((state) => state.products.items || []);
  const productStatus = useSelector((state) => state.products.status);
  const userStatus = useSelector((state) => state.user.status);
  const [loading, setLoading] = useState(true);

  // Define the fields dynamically
  const [customer, setCustomer] = useState({ username: "", userId: "" });
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [sellingPrice, setSellingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch all users on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchAllUsers());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (productStatus === "idle") dispatch(fetchProducts());
  }, [productStatus, dispatch]);

  if (loading || userStatus === "loading") {
    return <Loading />;
  }

  const calculateSellingPrice = (price) => {
    return price + price * 0.1; // Adding 10% to the base price
  };

  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  const validateFields = () => {
    const errors = {};
    if (!customer.username)
      errors["Customer Name"] = "Customer Name is required";
    if (!productID) errors["Product"] = "Product is required";
    if (!quantity || quantity <= 0)
      errors["Quantity"] = "Quantity must be greater than 0";
    if (!deliveryDate)
      errors["Date of Delivery"] = "Date of Delivery is required";
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
      label: "Customer Name",
      type: "select",
      value: customer.username,
      onChange: (e) => {
        const selectedUser = JSON.parse(e.target.value);
        setCustomer(selectedUser);
        handleFieldChange("Customer Name", e.target.value);
      },
      options: [
        { label: "Select customer", value: "" },
        ...users.map((user) => ({
          label: `${user.user_metadata.username} (${user.user_metadata.email})`,
          value: JSON.stringify({
            username: user.user_metadata.username,
            userId: user.id,
          }),
        })),
      ],
      errorMessage: validationErrors["Customer Name"],
    },
    {
      label: "Product",
      type: "select",
      value: productID,
      onChange: (e) => {
        const selectedProduct = products.find(
          (product) => product.id == e.target.value,
        );
        setProductID(e.target.value);
        setProductName(selectedProduct ? selectedProduct.name : "");
        const newSellingPrice = calculateSellingPrice(
          selectedProduct ? selectedProduct.price : 0,
        );
        setSellingPrice(newSellingPrice);
        setTotalPrice(calculateTotalPrice(newSellingPrice, quantity));
        handleFieldChange("Product", e.target.value);
      },
      options: [
        { label: "Select product", value: "" },
        ...products.map((product) => ({
          label: `${product.name} (${product.quantity})`,
          value: product.id,
        })),
      ],
      errorMessage: validationErrors["Product"],
    },
    {
      label: "Quantity",
      type: "number",
      placeholder: "Enter quantity",
      value: quantity,
      onChange: (e) => {
        const selectedProduct = products.find(
          (product) => product.id == productID,
        );
        const selectedQuantity = parseInt(e.target.value, 10);
        if (selectedProduct && selectedQuantity > selectedProduct.quantity) {
          setErrorMessage(
            `Selected quantity exceeds available stock of ${selectedProduct.quantity}`,
          );
        } else {
          setErrorMessage("");
          setQuantity(selectedQuantity);
          setTotalPrice(calculateTotalPrice(sellingPrice, selectedQuantity));
        }
        handleFieldChange("Quantity", e.target.value);
      },
      errorMessage: validationErrors["Quantity"],
    },
    {
      label: "Date of Delivery",
      type: "date",
      value: deliveryDate,
      onChange: (e) => {
        setDeliveryDate(e.target.value);
        handleFieldChange("Date of Delivery", e.target.value);
      },
      errorMessage: validationErrors["Date of Delivery"],
    },
    {
      label: "Status",
      type: "select",
      value: status,
      onChange: (e) => setStatus(e.target.value),
      options: [
        { label: "Pending", value: "Pending" },
        { label: "Delivered", value: "Delivered" },
        { label: "Canceled", value: "Canceled" },
        { label: "Shipped", value: "Shipped" },
      ],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (errorMessage) {
      return;
    }
    const selectedProduct = products.find((product) => product.id == productID);

    const newOrder = {
      customerName: customer.username,
      userId: customer.userId,
      orderValue: totalPrice,
      products: [
        {
          productId: productID,
          productName: productName,
          quantity: parseInt(quantity),
          price: selectedProduct
            ? calculateSellingPrice(selectedProduct.price)
            : 0,
        },
      ],
      expectedDelivery: deliveryDate,
      status,
    };

    dispatch(addOrder(newOrder))
      .then(() => {
        toast.success("Order added successfully!");
        closeModal();
      })
      .catch((error) => {
        console.error("Error adding order:", error);
        toast.error("Failed to add order. Please try again.");
      });
  };

  return (
    <ModalForm
      isOpen={isModalOpen}
      onClose={closeModal}
      title="New Order"
      formFields={formFields}
      onSubmit={handleSubmit}
      validationErrors={validationErrors}
    >
      <div className="mt-4 border-b pb-4">
        <h3 className="flex items-center justify-between text-lg font-semibold text-gray-600">
          Total Price: <span>${totalPrice.toFixed(2)}</span>
        </h3>
      </div>
    </ModalForm>
  );
};

export default AddOrder;
