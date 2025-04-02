import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalForm from "../../../layouts/Modal";
import { editSupplier, fetchSupplier } from "../../../redux/supplierSlice";
import { toast } from "react-toastify";

const EditSupplier = ({ isModalOpen, closeModal, supplierId }) => {
  const dispatch = useDispatch();
  const supplier = useSelector((state) =>
    state.suppliers.items.find((s) => s.id === supplierId),
  );

  // Define the fields dynamically
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (supplierId) {
      dispatch(fetchSupplier(supplierId));
    }
  }, [dispatch, supplierId]);

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setContactEmail(supplier.contact_email);
      setPhoneNumber(supplier.phone_number);
      setAddress(supplier.address);
    }
  }, [supplier]);

  const validateFields = () => {
    const errors = {};
    if (!name) errors["Name"] = "Name is required";
    if (!contactEmail) errors["Contact Email"] = "Contact Email is required";
    if (!phoneNumber) errors["Phone Number"] = "Phone Number is required";
    if (!address) errors["Address"] = "Address is required";
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
      label: "Name",
      type: "text",
      placeholder: "Enter supplier name",
      value: name,
      onChange: (e) => {
        setName(e.target.value);
        handleFieldChange("Name", e.target.value);
      },
      errorMessage: validationErrors["Name"],
    },
    {
      label: "Contact Email",
      type: "email",
      placeholder: "Enter contact email",
      value: contactEmail,
      onChange: (e) => {
        setContactEmail(e.target.value);
        handleFieldChange("Contact Email", e.target.value);
      },
      errorMessage: validationErrors["Contact Email"],
    },
    {
      label: "Phone Number",
      type: "text",
      placeholder: "Enter phone number",
      value: phoneNumber,
      onChange: (e) => {
        setPhoneNumber(e.target.value);
        handleFieldChange("Phone Number", e.target.value);
      },
      errorMessage: validationErrors["Phone Number"],
    },
    {
      label: "Address",
      type: "text",
      placeholder: "Enter address",
      value: address,
      onChange: (e) => {
        setAddress(e.target.value);
        handleFieldChange("Address", e.target.value);
      },
      errorMessage: validationErrors["Address"],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedSupplier = {
      id: supplierId,
      name,
      contact_email: contactEmail,
      phone_number: phoneNumber,
      address,
    };

    dispatch(editSupplier(updatedSupplier))
      .then(() => {
        toast.success(`${name} has been edited!`);

        closeModal();
      })
      .catch((error) => {
        console.error("Error updating supplier:", error);
      });
  };

  return (
    <ModalForm
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Edit Supplier"
      formFields={formFields}
      onSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};

export default EditSupplier;
