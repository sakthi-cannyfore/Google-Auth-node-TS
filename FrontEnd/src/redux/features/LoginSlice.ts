import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, PayloadData } from "./AuthType";
import API from "../services/api";

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
  error: null,
  user: null,
  accessToken: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Fetchlogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Fetchlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(Fetchlogin.rejected, (state, action) => {
        state.loading = state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default loginSlice.reducer;
