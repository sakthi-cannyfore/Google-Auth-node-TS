import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./AuthenticationSlice";
import API from "../services/api";

const Logout = createAsyncThunk("/auth/logout", async (_, { dispatch }) => {
  try {
    await API.post("/auth/logout");
  } catch (error: any) {
    console.log("logout Error", error);
  } finally {
    dispatch(logout());
  }
});
export default Logout;
