import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import CartOverlay from "./features/cart/CartOverlay";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <CartOverlay />
        <AppRoutes />
      </Router>

      <ToastContainer />
    </CartProvider>
  );
};

export default App;
