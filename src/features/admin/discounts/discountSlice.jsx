// discountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../../redux/supabaseClient";

// Thunks for CRUD operations

// Fetch all discounts
export const fetchDiscounts = createAsyncThunk(
  "discounts/fetchDiscounts",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add a discount
export const addDiscount = createAsyncThunk(
  "discounts/addDiscount",
  async (newDiscount, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("discounts")
        .insert([newDiscount])
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

// Edit a discount
export const editDiscount = createAsyncThunk(
  "discounts/editDiscount",
  async (updatedDiscount, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("discounts")
        .update(updatedDiscount)
        .eq("id", updatedDiscount.id)
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

// Delete a discount
export const deleteDiscount = createAsyncThunk(
  "discounts/deleteDiscount",
  async (discountId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("discounts")
        .delete()
        .eq("id", discountId);
      if (error) {
        throw error;
      }
      return discountId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Discounts slice
const discountSlice = createSlice({
  name: "discounts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addDiscount.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editDiscount.fulfilled, (state, action) => {
        const updatedDiscount = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === updatedDiscount.id,
        );
        if (index !== -1) {
          state.items[index] = updatedDiscount;
        }
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default discountSlice.reducer;
