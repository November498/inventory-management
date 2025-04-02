import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import bag1 from "/bags/bag-1.webp";
import { fetchProduct } from "../../redux/productSlice";
import { useCart } from "../../context/UseCard";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();

  const product = useSelector((state) =>
    state.products.items.find((p) => p.id == productId),
  );
  const productStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    if (!product) dispatch(fetchProduct(productId));
  }, [product, productId, dispatch]);

  if (productStatus === "loading" || !product)
    return <StatusMessage message="Loading product details..." />;

  const handleAddToCart = (redirectToCart = false) => {
    if (product && product.quantity > 0) {
      addItemToCart(product, true);
      if (redirectToCart) navigate("/user/cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-row items-center pb-12">
        <ProductImage
          src={product?.product_image || bag1}
          alt={product?.name || "Product Image"}
        />
        <ProductInfo product={product} handleAddToCart={handleAddToCart} />
      </div>
      <ProductDescription />
    </div>
  );
};

const StatusMessage = ({ message }) => (
  <p className="text-center text-lg">{message}</p>
);

const ProductImage = ({ src, alt }) => (
  <div className="w-1/2">
    <img src={src} alt={alt} className="h-full w-full" />
  </div>
);

const ProductInfo = ({ product, handleAddToCart }) => {
  const isInStock = product?.quantity > 0;

  return (
    <div className="flex w-1/2 flex-col gap-2 pl-8">
      <h1 className="text-2xl font-bold">{product?.name || "Product Name"}</h1>
      <p className="text-2xl font-extrabold">
        ${product?.price?.toFixed(2) || "0.00"}
      </p>
      <p className="text-lg">
        {product?.description || "No description available."}
      </p>
      {isInStock ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleAddToCart(true)}
            className="text-semibold w-fit bg-black px-4 py-1 text-sm uppercase text-white"
          >
            Buy now
          </button>
          <button
            onClick={() => handleAddToCart()}
            className="text-semibold w-fit border-b border-black px-1 text-sm uppercase"
          >
            Add to Cart
          </button>
        </div>
      ) : (
        <p className="text-lg text-red-500">Not in Stock</p>
      )}
    </div>
  );
};

const ProductDescription = () => (
  <div>
    <h2 className="pb-4 font-bold underline underline-offset-8">Description</h2>
    <p className="text-gray-700">
      As in handbags, the double ring and bar design defines the wallet shape,
      highlighting the front flap closure which is tucked inside the hardware.
      Completed with an organizational interior, the black leather wallet
      features a detachable chain. All products are made with carefully selected
      materials. Please handle with care for longer product life. - Protect from
      direct light, heat and rain. Should it become wet, dry it immediately with
      a soft cloth - Store in the provided flannel bag or box - Clean with a
      soft, dry cloth
    </p>
  </div>
);

export default ProductDetailsPage;
