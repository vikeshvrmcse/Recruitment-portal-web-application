// src/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// ✅ Export actions
export const { loginSuccess, logout } = authSlice.actions;

// ✅ Export reducer (IMPORTANT)
export default authSlice.reducer;