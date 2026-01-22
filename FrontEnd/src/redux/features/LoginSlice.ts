import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, PayloadData } from "./AuthType";
import API from "../services/api";
import { fetchGoogleUser, forgetPassword, resetPassword } from "./AuthThunk";

export const Fetchlogin = createAsyncThunk(
  "/auth/login",
  async (data: PayloadData, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error?.response.data?.message);
    }
  }
);

const initialState: AuthState = {
  loading: false,
  error: null as string | null,
  message: null as string | null,
  user: null,
  accessToken: null,
  twoFactorEnabled: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Fetchlogin.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      // test 
      .addCase(Fetchlogin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.twoFactorEnabled) {
          state.twoFactorEnabled = true;
          return;
        }
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.twoFactorEnabled = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(fetchGoogleUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(Fetchlogin.rejected, (state, action) => {
        state.loading = state.loading = false;
        state.error = action.payload as any;
      })

      // forget pass
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      });
  },
});

export const { setAccessToken, clearMessage } = loginSlice.actions;
export default loginSlice.reducer;
