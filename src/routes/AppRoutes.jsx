import { Routes, Route } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import { getCurrentUser } from "../features/auth/userSlice";
import Loading from "../utils/Loading";
import DashboardLayout from "../layouts/DashboardLayout";
import ShopLayout from "../layouts/ShopLayout";
import FileNotFound from "../pages/FileNotFound";

// Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Overview from "../pages/Overview";
import Inventory from "../pages/Inventory";
import Reports from "../pages/Reports";
import Suppliers from "../pages/Suppliers";
import Orders from "../pages/Orders";
import ProductPage from "../pages/ProductPage";
import Settings from "../pages/Settings";
import LandingPage from "../pages/user/LandingPage";
import ProductsPage from "../pages/user/ProductsPage";
import ProductDetailsPage from "../pages/user/ProductDetailsPage";
import UserPage from "../pages/user/UserPage";
import CartPage from "../pages/user/CartPage";
import OrdersPage from "../pages/user/OrdersPage";
import OrderDetailsPage from "../pages/user/OrderDetailsPage";
import PaymentPage from "../pages/user/PaymentPage";

// Route Configurations
const dashboardRoutes = [
  { path: "overview", element: <Overview /> },
  { path: "inventory", element: <Inventory /> },
  { path: "inventory/:id", element: <ProductPage /> },
  { path: "reports", element: <Reports /> },
  { path: "suppliers", element: <Suppliers /> },
  { path: "orders", element: <Orders /> },
  { path: "settings", element: <Settings /> },
];

const registrationRoutes = [
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
];

const userRoutes = [
  { path: "", element: <UserPage /> },
  { path: "cart", element: <CartPage /> },
  { path: "orders", element: <OrdersPage /> },
  { path: "orders/:orderId", element: <OrderDetailsPage /> },
  { path: "payment", element: <PaymentPage /> },
];

const AppRoutes = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getCurrentUser()).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <Routes>
      {/* Public Shop Routes */}
      <Route path="/" element={<ShopLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailsPage />} />
      </Route>

      {/* User Routes (Protected) */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute>
            <ShopLayout />
          </ProtectedRoute>
        }
      >
        {userRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      {/* Registration Routes */}
      {registrationRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Dashboard Routes (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {dashboardRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<FileNotFound />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<FileNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
