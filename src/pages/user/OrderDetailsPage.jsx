import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from "../../redux/orderSlice";
import { fetchProduct } from "../../redux/productSlice";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orders.selectedOrder);
  const ordersStatus = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    if (ordersStatus === "idle" || !orderDetails || orderDetails.id !== parseInt(orderId)) {
      dispatch(fetchOrder(orderId));
    }
  }, [ordersStatus, orderId, orderDetails, dispatch]);

  useEffect(() => {
    if (orderDetails?.products) {
      const missingProducts = orderDetails.products.filter(
        (item) => !products.find((product) => product.id === item.product_id)
      );
      missingProducts.forEach((item) => dispatch(fetchProduct(item.product_id)));
    }
  }, [orderDetails, products, dispatch]);

  if (ordersStatus === "loading") return <StatusMessage message="Loading order details..." />;
  if (ordersStatus === "failed") return <StatusMessage message={`Error: ${error}`} isError />;
  if (!orderDetails) return <StatusMessage message="Order not found." />;

  return (
    <div className="order-details-page container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Order Details</h1>
      <OrderInfo orderDetails={orderDetails} />
      <h2 className="mb-6 text-center text-2xl font-bold">Products in this Order</h2>
      {orderDetails.products.length === 0 ? (
        <StatusMessage message="No products found in this order." />
      ) : (
        <div className="space-y-6">
          {orderDetails.products.map((product) => (
            <ProductCard key={product.product_id} product={product} products={products} />
          ))}
        </div>
      )}
    </div>
  );
};

const StatusMessage = ({ message, isError = false }) => (
  <p className={`text-center text-lg ${isError ? "text-red-500" : ""}`}>{message}</p>
);

const OrderInfo = ({ orderDetails }) => (
  <div className="mb-8 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
    <p className="mb-2 text-lg font-semibold text-black">
      <strong>Order ID:</strong> {orderDetails.id}
    </p>
    <p className="mb-1 text-gray-600">
      <strong>Date:</strong> {new Date(orderDetails.created_at).toLocaleDateString()}
    </p>
    <p className="mb-1 text-gray-600">
      <strong>Status:</strong> {orderDetails.status}
    </p>
    <p className="text-gray-600">
      <strong>Total Amount:</strong> ${orderDetails.order_value.toFixed(2)}
    </p>
  </div>
);

const ProductCard = ({ product, products }) => {
  const productData = products.find((p) => p.id === product.product_id) || {};
  const { name = "Loading...", product_image = "", price = 0 } = productData;

  return (
    <div className="flex flex-col items-center justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-md md:flex-row">
      <img
        src={product_image}
        alt={name}
        className="mb-4 h-24 w-24 rounded object-cover md:mb-0 md:mr-4"
      />
      <div className="mb-4 flex-1 md:mb-0">
        <h3 className="text-xl font-semibold text-black">{name}</h3>
        <p className="mb-1 text-gray-600">
          <strong>Product ID:</strong> {product.product_id}
        </p>
        <p className="mb-1 text-gray-600">
          <strong>Quantity:</strong> {product.quantity}
        </p>
        <p className="text-gray-600">
          <strong>Price:</strong> ${price.toFixed(2)}
        </p>
      </div>
      <div className="text-2xl font-bold text-black">
        Total: ${(price * product.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderDetailsPage;