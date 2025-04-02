import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "./supabaseClient";

// Thunks for CRUD operations
// Fetch total quantity of products
export const fetchTotalQuantity = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("quantity,threshold");

    if (error) {
      throw error;
    }

    const totalQuantity = data.reduce(
      (acc, product) => acc + product.quantity,
      0,
    );

    const totalLowStock = data.reduce(
      (acc, product) => (product.quantity <= product.threshold ? acc + 1 : acc),
      0,
    );

    return { totalLowStock, totalQuantity };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch low quantity products (only 3)
export const fetchLowQuantityProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("product_image, quantity, threshold, name");

    if (error) {
      throw error;
    }

    const lowStockProducts = data
      .filter((product) => product.quantity <= product.threshold)
      .slice(0, 3);

    return lowStockProducts;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch a single product by ID
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Edit a product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async (updatedProduct, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updatedProduct)
        .eq("id", updatedProduct.id)
        .select();

      if (error) {
        throw error;
      }
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      if (error) {
        throw error;
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add a product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      // Validate required fields
      const {
        name,
        description,
        supplier_id,
        product_image,
        category,
        price,
        quantity,
        threshold,
      } = newProduct;
      if (
        !name ||
        !price ||
        quantity == null ||
        threshold == null ||
        !supplier_id ||
        !category
      ) {
        throw new Error(
          "Missing required fields: name, price, quantity, threshold, supplier_id, or category.",
        );
      }

      // Retrieve authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Prepare the product data
      const productData = {
        name,
        description: description || "", // Optional description
        supplier_id,
        product_image,
        category,
        price,
        quantity,
        threshold,
      };

      // Insert the product into the "products" table
      const { data: productResponse, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      // Return the created product
      return productResponse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update product stock
export const updateProductStock = createAsyncThunk(
  "products/updateProductStock",
  async ({ productId, stock }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ stock })
        .eq("id", productId)
        .single();
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Products slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        const product = action.payload;
        const index = state.items.findIndex((item) => item.id === product.id);
        if (index !== -1) {
          state.items[index] = product;
        } else {
          state.items.push(product);
        }
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === updatedProduct.id,
        );
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === updatedProduct.id,
        );
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      });
  },
});

export default productsSlice.reducer;
