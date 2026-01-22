import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import type { PayloadData } from "./AuthType";

export const RegisterAPi = createAsyncThunk(
  "auth/register",
  async (data: PayloadData, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/register", data);

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.messgae || " Registration Failed "
      );
    }
  }
);


export const fetchGoogleUser = createAsyncThunk(
  "auth/google-success",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/google/success", {
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Google login failed");
    }
  }
);



export const setupTwoFactor = createAsyncThunk(
  "auth/setup2fa",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/auth/2fauth/setup",
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const verifyTwoFactor = createAsyncThunk(
  "auth/verify2fa",
  async (code: string, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/auth/2fauth/verify",
        { code },
        { withCredentials: true }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
