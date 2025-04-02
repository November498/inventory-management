import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/userSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupError = useSelector((state) => state.user.error);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    const userData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      isAdmin: false, // Default value
    };

    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      setSuccessMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setErrors({ form: signupError || "Signup failed. Please try again." });
    }
  };

  return (
    <div className="flex h-dvh w-dvw p-4">
      <div className="hidden h-full w-full lg:block">
        <img
          src="registrationCover.png"
          alt="Signup Cover"
          className="h-full w-full"
        />
      </div>
      <div className="flex h-full w-full flex-col items-start justify-center lg:pl-20">
        <h1 className="mb-2 ml-6 text-2xl font-semibold text-gray-900">
          Create your account
        </h1>
        <h2 className="text-md mb-8 ml-6 text-gray-500">
          Welcome! Please enter your details to sign up.
        </h2>
        <form className="w-full lg:w-1/2" onSubmit={handleSubmit}>
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <InputField
            id="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
          />
          <div className="flex w-full flex-col items-center justify-between gap-4">
            <button
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Sign Up
            </button>
            {errors.form && (
              <p className="text-xs italic text-red-500">{errors.form}</p>
            )}
            {successMessage && (
              <p className="text-xs italic text-green-500">{successMessage}</p>
            )}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Already have an account?</p>
              <a
                className="inline-block align-baseline text-sm font-semibold text-blue-500 hover:text-blue-800"
                href="/login"
              >
                Log In
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}) => (
  <div className="mb-4">
    <label
      className="mb-1 block text-sm font-normal text-gray-700"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow placeholder:font-light focus:outline-none"
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-xs italic text-red-500">{error}</p>}
  </div>
);

export default Signup;
