import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginStatus = useSelector((state) => state.user.status);
  const loginError = useSelector((state) => state.user.error);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
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
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      setSuccessMessage("Login successful!");
      navigate("/dashboard/overview");
    } else {
      setErrors({ form: loginError || "Login failed. Please try again." });
    }
  };

  return (
    <div className="flex h-dvh w-dvw p-4">
      <div className="hidden h-full w-full lg:block">
        <img
          src="registrationCover.png"
          alt="Login Cover"
          className="h-full w-full"
        />
      </div>
      <div className="flex h-full w-full flex-col items-start justify-center lg:pl-20">
        <h1 className="mb-2 ml-6 text-2xl font-semibold text-gray-900">
          Log in to your account
        </h1>
        <h2 className="text-md mb-8 ml-6 text-gray-500">
          Welcome back! Please enter your details.
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
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
          <div className="flex w-full flex-col items-center justify-between gap-4">
            <button
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Login
            </button>
            {errors.form && (
              <p className="text-xs italic text-red-500">{errors.form}</p>
            )}
            {successMessage && (
              <p className="text-xs italic text-green-500">{successMessage}</p>
            )}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Don’t have an account?</p>
              <a
                className="inline-block align-baseline text-sm font-semibold text-blue-500 hover:text-blue-800"
                href="/signup"
              >
                Sign Up
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

export default Login;
