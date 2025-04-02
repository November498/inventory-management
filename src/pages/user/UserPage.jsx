import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../features/auth/userSlice";

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    if (userStatus === "idle") dispatch(getCurrentUser());
  }, [userStatus, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  if (userStatus === "loading") return <StatusMessage message="Loading your details..." />;
  if (!userInfo) return <LoginPrompt />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-center text-3xl font-bold">User Dashboard</h1>
      <UserInfo userInfo={userInfo} onLogout={handleLogout} />
      <UserLinks />
    </div>
  );
};

const StatusMessage = ({ message }) => (
  <p className="text-center text-lg">{message}</p>
);

const LoginPrompt = () => (
  <div className="text-center">
    <p className="text-lg">You are not logged in.</p>
    <Link to="/login" className="text-blue-500 transition-all hover:underline">
      Login
    </Link>
  </div>
);

const UserInfo = ({ userInfo, onLogout }) => {
  const username = userInfo.user_metadata?.username || "User Name";
  const initial = username[0]?.toUpperCase() || "U";

  return (
    <div className="mb-8 flex flex-col items-center gap-4 rounded-lg bg-gray-100 p-6 md:flex-row md:items-start md:gap-8">
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300 text-3xl font-bold text-white">
          {initial}
        </div>
        <div className="text-left">
          <h2 className="text-xl font-semibold">{username}</h2>
          <p className="text-gray-600">{userInfo.email}</p>
          <button
            onClick={onLogout}
            className="mt-4 rounded bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const UserLinks = () => {
  const links = [
    {
      to: "/user/orders",
      title: "My Orders",
      description: "View your order history and track your orders",
    },
    {
      to: "/user/cart",
      title: "My Cart",
      description: "Review items in your cart and proceed to checkout",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {links.map((link) => (
        <DashboardLink key={link.to} {...link} />
      ))}
    </div>
  );
};

const DashboardLink = ({ to, title, description }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow transition-all hover:bg-gray-50"
  >
    <h3 className="mb-2 text-xl font-bold">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </Link>
);

export default UserPage;