import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice";
import productReducer from "./productSlice";
import supplierReducer from "./supplierSlice";
import cartReducer from "./cartSlice";


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    orders: orderReducer,
    products: productReducer,
    suppliers: supplierReducer,
  },
});
