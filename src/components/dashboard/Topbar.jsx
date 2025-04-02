import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../redux/productSlice";
import OrderNotifications from "./OrderNotifications";

const Topbar = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items || []);
  const productStatus = useSelector((state) => state.products.status);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, productStatus]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex items-center justify-between bg-white p-6">
      {/* Search Bar */}
      <div className="relative flex w-1/3 items-center gap-2 rounded border border-gray-300 p-1 px-2">
        <span className="h-5 w-5 rounded-full border text-gray-400"></span>
        <input
          type="text"
          className="w-full outline-none placeholder:text-sm"
          placeholder="Search product..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <div className="absolute left-0 top-full mt-1 w-full rounded border border-gray-300 bg-white shadow-lg">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-b p-2 last:border-b-0 hover:text-blue-500"
                  onClick={() => setSearchTerm("")}
                >
                  <Link to={`/dashboard/inventory/${product.id}`}>
                    {product.name}
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No products found</div>
            )}
          </div>
        )}
      </div>
      {/* Notification and Profile */}
      <div className="flex items-center gap-4">

        <OrderNotifications />
        <Link to="/">
          <img
            src="https://avatar.iran.liara.run/public/1"
            className="aspect-square h-7 w-7 rounded-full bg-black"
            alt="Profile"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
