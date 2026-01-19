import { createSlice } from "@reduxjs/toolkit";
import { RegisterAPi } from "./AuthThunk";
import type { AuthState } from "./AuthType";

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("accesstoken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RegisterAPi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(RegisterAPi.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(RegisterAPi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
