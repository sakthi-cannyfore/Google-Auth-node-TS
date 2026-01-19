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
