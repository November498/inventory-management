import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../redux/productSlice";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productsStatus = useSelector((state) => state.products.status);

  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (productsStatus === "idle") dispatch(fetchProducts());
  }, [productsStatus, dispatch]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setCategoryFilter(queryParams.get("category") || "All");
    setSearchTerm(queryParams.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;
      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Low" && product.price < 50) ||
        (priceFilter === "Medium" &&
          product.price >= 50 &&
          product.price < 150) ||
        (priceFilter === "High" && product.price >= 150);
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, priceFilter, categoryFilter]);

  const handleFilterChange = (type, value) => {
    const queryParams = new URLSearchParams(location.search);
    if (value !== "All") queryParams.set(type, value);
    else queryParams.delete(type);
    navigate(`?${queryParams.toString()}`);
  };

  return (
    <div className="products-page container mx-auto px-4 py-8 pb-24">
      <Header />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={(value) => handleFilterChange("search", value)}
        priceFilter={priceFilter}
        setPriceFilter={(value) => setPriceFilter(value)}
        categoryFilter={categoryFilter}
        setCategoryFilter={(value) => handleFilterChange("category", value)}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
};

const Header = () => (
  <header className="mb-8 text-center">
    <h1 className="text-3xl font-bold">Our Products</h1>
    <p className="text-lg">Find the best products that suit your needs</p>
  </header>
);

const Filters = ({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  categoryFilter,
  setCategoryFilter,
}) => (
  <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search products..."
      className="w-full border px-4 py-2 md:w-full"
    />
    <select
      value={priceFilter}
      onChange={(e) => setPriceFilter(e.target.value)}
      className="ml-auto border px-4 py-2"
    >
      <option value="All">All Price Ranges</option>
      <option value="Low">Below $50</option>
      <option value="Medium">$50 - $150</option>
      <option value="High">Above $150</option>
    </select>
    <select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      className="ml-auto border px-4 py-2"
    >
      <option value="All">All Categories</option>
      <option value="handle_bags">Handle Bags</option>
      <option value="crossbody_bags">Crossbody Bags</option>
      <option value="shoulder_bags">Shoulder Bags</option>
      <option value="tote_bags">Tote Bags</option>
    </select>
  </div>
);

const ProductList = ({ products }) => (
  <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
    {products.length > 0 ? (
      products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))
    ) : (
      <p className="text-center text-lg">No products found.</p>
    )}
  </section>
);

const ProductCard = ({ product }) => (
  <div className="product-card flex flex-col items-center justify-center bg-slate-100 p-4">
    <img
      src={product.product_image}
      alt={product.name}
      className="mb-4 w-[70%] rounded"
    />
    <h3 className="text-md mb-2 font-semibold">{product.name}</h3>
    <p className="mb-4 text-gray-700">${product.price.toFixed(2)}</p>
    <Link
      to={`/products/${product.id}`}
      className="text-semibold border-b border-black px-1 text-sm uppercase transition-all hover:text-gray-500"
    >
      Shop Now
    </Link>
  </div>
);

export default ProductsPage;
