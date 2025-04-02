import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "./supabaseClient";

// Thunks for CRUD operations

// Fetch suppliers count without thunk
export const fetchSuppliersCount = async () => {
  try {
    const { count, error } = await supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Error fetching suppliers count:", error.message);
    throw error;
  }
};

// Fetch all suppliers
export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("suppliers").select("*");

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch a single supplier by ID
export const fetchSupplier = createAsyncThunk(
  "suppliers/fetchSupplier",
  async (supplierId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", supplierId)
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

// Update a supplier
export const editSupplier = createAsyncThunk(
  "suppliers/editSupplier",
  async (supplier, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .update({
          name: supplier.name,
          contact_email: supplier.contact_email,
          phone_number: supplier.phone_number,
          address: supplier.address,
        })
        .eq("id", supplier.id);
      if (error) {
        throw error;
      }
      return supplier;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete a supplier
export const deleteSupplier = createAsyncThunk(
  "suppliers/deleteSupplier",
  async (supplierId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplierId);
      if (error) {
        throw error;
      }
      return supplierId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add a supplier
export const addSupplier = createAsyncThunk(
  "suppliers/addSupplier",
  async (newSupplier, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([newSupplier])
        .select();
      // .single();
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update supplier stock
export const updateSupplierStock = createAsyncThunk(
  "suppliers/updatesupplierStock",
  async ({ supplierId, stock }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .update({ stock })
        .eq("id", supplierId)
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

// suppliers slice
const suppliersSlice = createSlice({
  name: "suppliers",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSupplier.fulfilled, (state, action) => {
        const supplier = action.payload;
        const index = state.items.findIndex((item) => item.id === supplier.id);
        if (index !== -1) {
          state.items[index] = supplier;
        } else {
          state.items.push(supplier);
        }
      })
      .addCase(editSupplier.fulfilled, (state, action) => {
        const updatedsupplier = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === updatedsupplier.id,
        );
        if (index !== -1) {
          state.items[index] = updatedsupplier;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSupplierStock.fulfilled, (state, action) => {
        const updatedsupplier = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === updatedsupplier.id,
        );
        if (index !== -1) {
          state.items[index] = updatedsupplier;
        }
      });
  },
});

export default suppliersSlice.reducer;
