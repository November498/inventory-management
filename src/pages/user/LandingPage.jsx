import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import bag1 from "/bags/bag-1.webp";
import bag2 from "/bags/bag-2.webp";
import bag3 from "/bags/bag-3.webp";
import bag4 from "/bags/bag-4.webp";
import category1 from "/categories/category-1.webp";
import category2 from "/categories/category-2.webp";
import category3 from "/categories/category-3.webp";
import category4 from "/categories/category-4.webp";
import { fetchProducts } from "../../redux/productSlice";

const randomImages = [bag1, bag2, bag3, bag4];
const categories = [
  {
    id: 1,
    name: "Handle bags",
    image: category1,
    link: "category=handle_bags",
  },
  {
    id: 2,
    name: "Crossbody bags",
    image: category2,
    link: "category=crossbody_bags",
  },
  {
    id: 3,
    name: "Shoulder bags",
    image: category3,
    link: "category=shoulder_bags",
  },
  { id: 4, name: "Tote bags", image: category4, link: "category=tote_bags" },
];

const ProductCard = ({ product, imageUrl }) => (
  <div className="product-card flex flex-col items-center justify-center bg-slate-100 p-4">
    <img
      src={product.product_image || imageUrl}
      alt={product.name}
      className="mb-4 w-[70%] rounded"
    />
    <h3 className="text-md mb-2 font-semibold">{product.name}</h3>
    <Link
      to={`/products/${product.id}`}
      className="text-semibold border-b border-black px-1 text-sm uppercase transition-all hover:text-gray-500"
    >
      Shop Now
    </Link>
  </div>
);

const CategoryLink = ({ category }) => (
  <Link
    to={`/products/?${category.link}`}
    className="relative flex h-56 flex-col items-end justify-end"
  >
    <img
      src={category.image}
      alt={category.name}
      className="absolute h-full w-full object-cover brightness-75 transition-all hover:brightness-50"
    />
    <div className="z-10 bg-black px-3 pb-1 pt-2 text-sm uppercase text-white">
      {category.name}
    </div>
  </Link>
);

const SectionHeader = ({ title, children }) => (
  <section className="mb-12 text-center">
    <h2 className="mb-4 text-2xl font-bold">{title}</h2>
    {children}
  </section>
);

const LandingPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productsStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  return (
    <div className="landing-page">
      <main className="container mx-auto px-4 py-8">
        <SectionHeader title="Discover Our Products">
          <p className="text-lg">
            Browse through our wide selection of products and find what you
            need.
          </p>
        </SectionHeader>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              imageUrl={randomImages[index % randomImages.length]}
            />
          ))}
        </section>

        <div className="flex items-center justify-center py-12">
          <Link
            to="/products"
            className="text-semibold border border-black px-3 py-1 uppercase"
          >
            Check all latest
          </Link>
        </div>

        <SectionHeader title="Shop by Categories" />

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryLink key={category.id} category={category} />
          ))}
        </section>

        <div className="flex items-center justify-center pt-12">
          <Link
            to="/products"
            className="text-semibold border border-black px-3 py-1 uppercase"
          >
            Browse all categories
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2024 Our Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
