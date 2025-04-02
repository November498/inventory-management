import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/const";

// URL for the API
const API_URL = `${BASE_URL}/orders`;

// Load initial cart items from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cartItems");
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
    return [];
  }
};

// Save cart items to localStorage
const saveCartToLocalStorage = (cartItems) => {
  try {
    const serializedCart = JSON.stringify(cartItems);
    localStorage.setItem("cartItems", serializedCart);
  } catch (e) {
    console.warn("Failed to save cart to localStorage", e);
  }
};

// // Thunk for placing an order
export const placeOrderAsync = createAsyncThunk(
  "cart/placeOrderAsync",
  async (order, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, order);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromLocalStorage(),
    orderStatus: "idle",
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.items.find(
        (item) => item.id === product.id,
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveCartToLocalStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingProduct = state.items.find((item) => item.id === productId);
      if (existingProduct) {
        existingProduct.quantity = quantity;
      }
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderAsync.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(placeOrderAsync.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.items = [];
        saveCartToLocalStorage(state.items);
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.error = action.payload;
        console.error("Failed to place order: ", action.payload);
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
