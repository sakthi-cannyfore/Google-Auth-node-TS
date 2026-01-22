import { createSlice } from "@reduxjs/toolkit";
import { RegisterAPi, setupTwoFactor, verifyTwoFactor } from "./AuthThunk";
import type { AuthState } from "./AuthType";

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
  accessToken: null,
  twoFactorEnabled: false,
  otpUrl: null,
};

const AuthenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.twoFactorEnabled = false;
      localStorage.removeItem("accessToken");
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
      })

      .addCase(setupTwoFactor.pending, (state) => {
        state.loading = true;
      })
      .addCase(setupTwoFactor.fulfilled, (state, action) => {
        state.loading = false;
        state.otpUrl = action.payload.otpUrl;
      })
      .addCase(setupTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyTwoFactor.fulfilled, (state) => {
        state.twoFactorEnabled = true;
        state.otpUrl = null;
      });
  },
});

export const { logout } = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;
