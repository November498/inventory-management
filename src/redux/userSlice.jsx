import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAuthClient, supabase } from "./supabaseClient";

// Thunks for user operations

// Register a new user
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          isAdmin: userData.isAdmin,
        },
      },
    });

    if (error) {
      return rejectWithValue(error.message);
    }
    return data.user;
  },
);

// Login an existing user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return rejectWithValue(error.message);
    }

    return data.user;
  },
);

// Logout the user
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
    return true;
  },
);

// Get current user session
export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return null;

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch all users except isAdmin
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { users },
        error,
      } = await adminAuthClient.listUsers();

      if (error) {
        throw new Error(error.message);
      }
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.userInfo = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
