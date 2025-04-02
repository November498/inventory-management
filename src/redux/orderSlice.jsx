import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "./supabaseClient";

// Thunks for CRUD operations

// Subscribe to the 'new_orders' channel
supabase
  .channel('new_orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
    // console.log('New order added:', payload);
    // alert(`New order added: ${JSON.stringify(payload.new)}`);
  })
  .subscribe();

// create fetch for above code

// Fetch all orders for authenticated user, ordered by latest
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch all orders (admin level access) and order by `created_at` in descending order
      const { data, error } = await supabase.from("orders").select(`
        id,
        customer_name,
        order_value,
        status,
        expected_delivery,
        order_items (
          quantity,
          price,
          products (
            name,
            price,
            id
          )
        ),
        created_at
      `);

      if (error) {
        throw error;
      }

      return data.map((order) => ({
        orderId: order.id,
        customerName: order.customer_name,
        products: order.order_items.map((item) => ({
          name: item.products.name,
          quantity: item.quantity,
          price: item.products.price,
          sold: item.price,
          productId: item.products.id,
        })),
        totalQuantity: order.order_items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
        status: order.status,
        expectedDelivery: order.expected_delivery,
        orderValue: order.order_value,
        created_at: order.created_at,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch only the authenticated user's orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      // Retrieve authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Fetch orders for the authenticated user
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch a single order by ID
export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      // Fetch the order by ID
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) {
        throw orderError;
      }

      // Fetch the order items related to the order
      const { data: orderItemsData, error: orderItemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (orderItemsError) {
        throw orderItemsError;
      }

      // Fetch product details for each order item
      const productsData = await Promise.all(
        orderItemsData.map(async (item) => {
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", item.product_id)
            .single();

          if (productError) {
            throw productError;
          }

          return { ...item, product: productData };
        }),
      );

      return { ...orderData, products: productsData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (error) {
        throw error;
      }
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add an order
export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async (newOrder, { rejectWithValue }) => {
    try {
      // Retrieve authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Insert the order into the "orders" table
      const orderData = {
        customer_name: newOrder.customerName,
        customer_email: newOrder.customerEmail,
        status: newOrder.status || "pending",
        order_date: new Date().toISOString(),
        expected_delivery: newOrder.expectedDelivery || null, // Optional
        user_id: newOrder.userId,
      };

      const { data: orderResponse, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Prepare and insert order items
      const orderItems = newOrder.products.map((product) => ({
        order_id: orderResponse.id,
        product_id: product.productId,
        quantity: product.quantity,
        price: product.price,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) {
        throw orderItemsError;
      }

      // Format the order response to match the structure used in fetchOrders
      const formattedOrder = {
        orderId: orderResponse.id,
        customerName: orderResponse.customer_name,
        products: orderItems.map((item) => ({
          name: newOrder.products.find(
            (product) => product.productId == item.product_id,
          ).productName,
          quantity: item.quantity,
          price: item.price,
        })),
        orderValue: newOrder.orderValue,
        totalQuantity: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        status: orderResponse.status,
        expectedDelivery: orderResponse.expected_delivery,
      };

      // Return the formatted order
      return formattedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
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

// Orders slice
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    userOrders: [],
    selectedOrder: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload); // Add the new order to the state
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.meta.arg;
        const index = state.items.findIndex(
          (item) => item.orderId === updatedOrder.orderId,
        );
        if (index !== -1) {
          state.items[index].status = updatedOrder.status;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (order) => order.orderId !== action.payload,
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
