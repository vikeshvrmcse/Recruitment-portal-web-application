// src/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";



const savedAuth = JSON.parse(localStorage.getItem("auth"));

// const initialState = {
//   user: null,
//   isAuthenticated: false,
// };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedAuth || null,
    isAuthenticated: !!savedAuth,
    level: savedAuth?.level || null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.level = action.payload.level;
      console.log(state.level);
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.level = null;

      localStorage.removeItem("auth");
    }
  }
});

//Export actions
export const { loginSuccess, logout } = authSlice.actions;

//Export reducer (IMPORTANT)
export default authSlice.reducer;